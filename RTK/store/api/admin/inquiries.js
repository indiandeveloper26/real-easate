
import { api } from "../../../services/api";

export const propertyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================
    // ADMIN - GET ALL PROPERTY INQUIRIES
    // =====================================
    getAdminInquiries: builder.query({
      query: ({
        status = "All",
        search = "",
        page = 1,
      } = {}) => ({
        url: "/admin/inquiries",
        method: "GET",
        params: {
          status,
          search,
          page,
        },
      }),

      // Har page ka response alag cache hoga.
      // page 1 = first 10 records
      // page 2 = next 10 records
      keepUnusedDataFor: 60,

      // Mount hone ya arguments change hone par refetch.
      refetchOnMountOrArgChange: true,

      providesTags: ["AdminInquiries"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAdminInquiriesQuery,
} = propertyApi;

