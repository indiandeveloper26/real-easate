import Redis from "ioredis";

if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is missing in backend .env");
}

const redis = new Redis(process.env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 2,
    enableReadyCheck: true,
});

redis.on("connect", () => {
    console.log("✅ Redis connected");
});

redis.on("error", (error) => {
    console.error("❌ Redis error:", error.message);
});

export default redis;
