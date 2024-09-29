import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postData } from "@/utils/axiosInstance";
import Cookies from "js-cookie";

const getInitialState = () => {
  if (typeof window === "undefined") {
    return { user: null, role: null, loading: false, error: null };
  }
  const token = localStorage.getItem("token");
  const tokenExpiration = localStorage.getItem("tokenExpiration");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  const isExpired = tokenExpiration && new Date().getTime() > tokenExpiration;
  if (isExpired) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    return { user: null, role: null, loading: false, error: null };
  }

  return { user, role, loading: false, error: null };
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await postData("/auth/login", credentials);
      const { message, token, role, user } = response;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));

      // Optional: Set an expiration time for the token
      const expirationDate = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem("tokenExpiration", expirationDate);

      return { message, role, user };
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await postData("/auth/logout");

      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      return;
    } catch (error) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    // Action to logout the user
    logout: (state) => {
      state.user = null;
      state.role = null;
      Cookies.remove("token");
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload.role;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.role = null;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload || "Logout failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
