import { api } from "./api";

export const propertyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query({
      query: (page = 1) => ({
        url: "/admin/properties",
        method: "GET",
        params: {
          page,
          limit: 10,
        },
      }),

      // 🔥 VERY IMPORTANT
      // All pages use ONE cache entry
      serializeQueryArgs: ({ endpointName }) => endpointName,

      // 🔥 Page 2/3/4 ko existing cache mein add karo
      merge: (currentCache, newData, { arg }) => {
        // Page 1 = fresh cache
        if (arg === 1) {
          return newData;
        }

        // Page 2+
        currentCache.properties.push(
          ...(newData.properties || [])
        );

        currentCache.pagination = newData.pagination;
      },

      // 🔥 Page change hone par API call
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },

      // 🔥 Cache ko 5 minute tak rakho
      keepUnusedDataFor: 300,

      providesTags: ["Properties"],
    }),

    getProperty: builder.query({
      query: (id) => ({
        url: `/admin/properties/${id}`,
        method: "GET",
      }),

      // API response: { success, message, property }
      transformResponse: (response) => response.property,

      // Cache each property by its ID
      providesTags: (result, error, id) => [
        { type: "Property", id },
      ],

      // Keep unused property data cached for 5 minutes
      keepUnusedDataFor: 300,
    }),



    // =====================================
    // GET RECENT 10 PROPERTIES - HOMEPAGE
    // =====================================
    getRecentProperties: builder.query({
      query: () => ({
        url: "/properties/recent",
        method: "GET",
      }),

      // Cache data for 5 minutes after unused
      keepUnusedDataFor: 300,

      // Refetch when the user returns to the page
      refetchOnMountOrArgChange: 60,

      // Refetch when a mutation invalidates this tag
      providesTags: ["Properties"],
    }),






    getFilteredProperties: builder.query({
      query: ({
        page = 1,
        limit = 10,
        listingType = "all",
        propertyTypes = [],
        city = "",
        minPrice = "",
        maxPrice = "",
        bedrooms = "any",
        sortBy = "newest",
        search = "",
      } = {}) => {
        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("limit", String(limit));
        params.set("sortBy", sortBy);

        if (listingType !== "all") {
          params.set("listingType", listingType);
        }

        if (propertyTypes.length > 0) {
          params.set("propertyTypes", propertyTypes.join(","));
        }

        if (city.trim()) params.set("city", city.trim());
        if (minPrice !== "") params.set("minPrice", String(minPrice));
        if (maxPrice !== "") params.set("maxPrice", String(maxPrice));

        if (bedrooms !== "any") {
          params.set("bedrooms", String(bedrooms));
        }

        if (search.trim()) params.set("search", search.trim());

        return {
          url: `/NoramUsers/Filter_Properties/${params.toString()}`,
          method: "GET",
        };
      },

      // Cache data for 5 minutes after unused
      keepUnusedDataFor: 300,

      // Refetch when the user returns to the page
      refetchOnMountOrArgChange: 60,

      // Refetch when a mutation invalidates this tag
      providesTags: ["Properties"],
    }),









    createProperty: builder.mutation({
      query: (body) => ({
        url: "/properties",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Properties"],
    }),

    updateProperty: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/properties/${id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: [
        "Properties",
      ],
    }),

    deleteProperty: builder.mutation({
      query: (id) => ({
        url: `/admin/properties/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Properties"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetPropertiesQuery,
  useGetRecentPropertiesQuery,
  useGetPropertyQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useGetFilteredPropertiesQuery,
} = propertyApi;