import redis from "./redis.js";

const CACHE_PREFIX = "property-search:";
const CACHE_TTL_SECONDS = 300;

const pendingRequests = new Map();

export function getSearchCacheKey(filters) {
    const normalizedFilters = Object.fromEntries(
        Object.entries(filters || {})
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );

    return `${CACHE_PREFIX}${JSON.stringify(normalizedFilters)}`;
}

export async function getOrSetSearchCache(filters, fetchData) {
    const cacheKey = getSearchCacheKey(filters);

    // Check Redis first
    try {
        const cachedData = await redis.get(cacheKey);


        if (cachedData !== null) {
            console.log("[CACHE HIT]", cacheKey);
            return JSON.parse(cachedData);
        }


    } catch (error) {
        console.error("[REDIS READ ERROR]", error.message);
    }

    // Share an ongoing fetch for identical requests
    if (pendingRequests.has(cacheKey)) {
        console.log("[CACHE REQUEST SHARED]", cacheKey);
        return pendingRequests.get(cacheKey);
    }

    console.log("[CACHE MISS]", cacheKey);

    const request = (async () => {
        try {
            // Execute original MongoDB query
            const data = await fetchData();


            // Save successful result in Redis
            try {
                await redis.set(
                    cacheKey,
                    JSON.stringify(data),
                    "EX",
                    CACHE_TTL_SECONDS
                );

                console.log("[CACHE SAVED]", cacheKey);
            } catch (error) {
                console.error("[REDIS WRITE ERROR]", error.message);
            }

            return data;
        } finally {
            pendingRequests.delete(cacheKey);
        }


    })();

    pendingRequests.set(cacheKey, request);

    return request;
}

export async function clearPropertySearchCache() {
    let cursor = "0";
    let deleted = 0;

    do {
        const [nextCursor, keys] = await redis.scan(
            cursor,
            "MATCH",
            `${CACHE_PREFIX}*`,
            "COUNT",
            100
        );


        cursor = nextCursor;

        if (keys.length > 0) {
            deleted += await redis.del(...keys);
        }


    } while (cursor !== "0");

    console.log("[CACHE CLEARED]", deleted);
    return deleted;
}
