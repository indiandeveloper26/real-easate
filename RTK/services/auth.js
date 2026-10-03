import { api } from "./api";


export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    adminSignup: builder.mutation({
      query: (body) => ({
        url: "/admin/signup",
        method: "POST",
        body,
      }),
    }),

    adminLogin: builder.mutation({
      query: (body) => ({
        url: "/admin/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),

    getAdminMe: builder.query({
      query: () => "/admin/me",
      providesTags: ["Admin"],
    }),

    adminLogout: builder.mutation({
      query: () => ({
        url: "/admin/logout",
        method: "POST",
      }),
      invalidatesTags: ["Admin"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useAdminSignupMutation,
  useAdminLoginMutation,
  useGetAdminMeQuery,
  useAdminLogoutMutation,
} = authApi;