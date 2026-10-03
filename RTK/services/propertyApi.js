import { api } from "./api";

export const propertyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query({
      query: (params = {}) => ({
        url: "/properties",
        method: "GET",
        params,
      }),

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

      invalidatesTags: (result, error, { id }) => [
        "Properties",
        {
          type: "Property",
          id,
        },
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