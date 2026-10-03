import { api } from "./api";

export const propertyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query({
      query: (page = 1) => ({
        url: "/admin/properties",
        method: "GET",
        params: {
          page,
          limit: 100,
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
      query: (id) => `/properties/${id}`,

      providesTags: (result, error, id) => [
        {
          type: "Property",
          id,
        },
      ],
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
        url: `/properties/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Properties"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
} = propertyApi;