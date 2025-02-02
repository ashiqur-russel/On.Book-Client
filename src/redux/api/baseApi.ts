/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  DefinitionType,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { logOut, setUser } from "../features/auth/authSlice";
import { toast } from "sonner";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  //baseUrl: "https://book-on.vercel.app/api",
  baseUrl: "http://localhost:5001/api",

  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);
  console.log(result);

  if (result?.error?.status === 409) {
    toast.error((result?.error?.data as { message: string })?.message);
  }

  if (result?.error?.status === 404) {
    toast.error((result?.error?.data as { message: string })?.message);
  }

  if (result?.error?.status === 401) {
    const res = await fetch("http://localhost:5173/api/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (data?.data?.accessToken) {
      const user = (api.getState() as RootState).auth.user;

      api.dispatch(
        setUser({
          user,
          token: data.data.accessToken,
        })
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  endpoints: () => ({}),
});
