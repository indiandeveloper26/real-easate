import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "/backend/api",
  }),

  tagTypes: [
    "Properties",
    "Property",
    "Enquiries",
    "AdminInquiries",
    "Properties",
    "User",
  ],

  endpoints: () => ({}),
});