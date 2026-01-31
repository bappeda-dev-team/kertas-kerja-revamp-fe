import { NextRequest } from "next/server";
import { getCookie } from "cookies-next";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface ReqApi {
  type: "auth" | "withoutAuth";
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  token?: string;
  web?: string;
  req?: NextRequest;
}

export async function fetchApi({
  type,
  url,
  method,
  body,
  token,
  web
}: ReqApi) {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const headers = new Headers();

  const isFormData = body instanceof FormData;

  const cookieToken = getCookie("auth") as string | undefined;
  const overrideToken = token || cookieToken;

  if (type === "auth") {
    if (!isFormData) {
      headers.append("Content-Type", "application/json");
    }

    if (web === "basic") {
      headers.append("Authorization", `Basic ${process.env.BASIC_AUTH_TOKEN}`);
    } else {
      let authToken: string | null = null;

      if (overrideToken) {
        authToken = overrideToken;
      } else if (typeof window === "undefined") {
        // const session: any = await getServerSession(authOptions);
        // authToken = session?.accessToken ?? null;
      } else {
        const session: any = await getSession();
        authToken = session?.accessToken ?? null;
      }

      headers.append("Authorization", `Bearer ${authToken}`);
    }
  } else if (type === "withoutAuth") {
    headers.append("Content-Type", "application/json");
  }

  try {
    const response = await fetch(`${baseURL}${url}`, {
      method,
      headers,
      body: body
        ? isFormData
          ? body
          : JSON.stringify(body)
        : null
    });

    if (response.status === 403) {
      if (typeof window === "undefined") redirect("/unauthorized");
      else window.location.href = "/unauthorized";
    }

    let data = null;
    try {
      data = await response.json();
    } catch {}

    return {
      status: response.status,
      message: response.ok ? "Success" : response.statusText,
      data
    };

  } catch (error: any) {
    return error;
  }
}
