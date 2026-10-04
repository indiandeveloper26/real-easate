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
} = propertyApi;