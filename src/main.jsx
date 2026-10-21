import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";

import "./index.css";
import App from "./App.jsx";
import { backendUrl, ENABLE_SESSION_REFRESH } from "./components/config.js";

axios.defaults.withCredentials = true;

// Globally include cookies for fetch requests.
const originalFetch = window.fetch.bind(window);

let refreshPromise = null;

const refreshSession = () => {
  console.log(ENABLE_SESSION_REFRESH);
  if (!ENABLE_SESSION_REFRESH) {
    return Promise.reject(new Error("Session refresh is desabled"));
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${backendUrl}/api/User/refresh`,
        {},
        {
          withCredentials: true,
          skipAuthRefresh: true,
        },
      )
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const logout = async () => {
  try {
    await axios.post(
      `${backendUrl}/api/User/logout`,
      {},
      {
        withCredentials: true,
        skipAuthRefresh: true,
      },
    );
  } catch (error) {
    console.error("Logout API failed:", error);
  } finally {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");

    if (window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
  }
};

// Prevent multiple simultaneous logout operations.
let logoutPromise = null;

const handleLogout = () => {
  if (!logoutPromise) {
    logoutPromise = logout().finally(() => {
      logoutPromise = null;
    });
  }

  return logoutPromise;
};

// Handle 401 responses from fetch globally.
window.fetch = async (input, init = {}) => {
  const requestUrl =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input.url;

  const response = await originalFetch(input, {
    ...init,
    credentials: "include",
  });

  if (response.status !== 401) {
    return response;
  }

  const url = requestUrl || "";

  const isAuthEndpoint =
    url.includes("/api/User/login") || url.includes("/api/User/logout");

  if (isAuthEndpoint) {
    return response;
  }

  // Refresh disabled: log out immediately.
  if (!ENABLE_SESSION_REFRESH) {
    await handleLogout();
    return response;
  }

  // Refresh enabled: try refreshing and retry the original request once.
  try {
    await refreshSession();

    const retryResponse = await originalFetch(input, {
      ...init,
      credentials: "include",
    });

    if (retryResponse.status === 401 || retryResponse.status === 403) {
      await handleLogout();
    }

    return retryResponse;
  } catch (error) {
    await handleLogout();
    throw error;
  }
};

// Handle 401 responses from Axios globally.
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      error.response?.status !== 403 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || "";

    const isAuthEndpoint =
      url.includes("/api/User/login") || url.includes("/api/User/logout");

    if (isAuthEndpoint || originalRequest.skipAuthRefresh) {
      return Promise.reject(error);
    }

    console.log(ENABLE_SESSION_REFRESH);

    if (!ENABLE_SESSION_REFRESH) {
      await handleLogout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshSession();
      return axios(originalRequest);
    } catch (refreshError) {
      await handleLogout();
      return Promise.reject(refreshError);
    }
  },
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
