import { api } from "../../../services/api";

export const propertyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================
    // EXISTING PROPERTY ENDPOINTS
    // =====================================

    // Apne existing endpoints yahan waise hi rehne do.

    // =====================================
    // ADMIN - GET ALL PROPERTY INQUIRIES
    // =====================================
    getAdminInquiries: builder.query({
      query: ({ status = "All", search = "" } = {}) => ({
        url: "/admin/inquiries",
        method: "GET",
        params: {
          status,
          search,
        },
      }),

      // API response:
      // { success, stats, inquiries, count }

      keepUnusedDataFor: 300,

      // Page par wapas aane par 60 sec baad fresh data
      refetchOnMountOrArgChange: 60,

      providesTags: ["AdminInquiries"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAdminInquiriesQuery,
} = propertyApi;