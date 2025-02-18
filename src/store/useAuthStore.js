// create a global state manager
// different states and functions to use in different components

import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { saveToLocalStorage, getStoredAuthDetails } from "../lib/localStorage";
import { LogOut } from "lucide-react";

export const useAuthStore = create((set) => ({
    authUser: null,
    // different loading states to be used
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const authDetails = getStoredAuthDetails();
            if (!authDetails) {
                console.error("Auth details missing from localStorage");
                set({ authUser: null });
                return;
            }

            // Validate authentication
            const res = await axiosInstance.get('/auth/validate_token', {
                headers: {
                    "access-token": authDetails.accessToken,
                    client: authDetails.client,
                    expiry: authDetails.expiry,
                    uid: authDetails.uid,
                }
            });

            if (res.data && res.data.success) {
                set({ authUser: res.data.data });
                console.log("Auth validated:", res.data);
            } else {
                console.error("Authentication failed:", res.data);
                set({ authUser: null });
            }
        } catch (error) {
            set({ authUser: null });
            console.error("Error checking auth", error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const { email, password, password_confirmation } = data;

            if (!email || !password || !password_confirmation) {
                throw new Error("Email, password, and password confirmation are required");
            }
            if (password !== password_confirmation) {
                throw new Error("Passwords do not match");
            }
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailPattern.test(email)) {
                throw new Error("Invalid email format");
            }

            const res = await axiosInstance.post('/api/v1/auth/', {
                email,
                password,
                password_confirmation
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            // Save to localStorage
            const { token, user } = res.data;
            saveToLocalStorage('auth_token', token);
            saveToLocalStorage('user_info', user);

            set({ authUser: res.data });
            toast.success("Account created Successfully");

        } catch (error) {
            toast.error(error.message || error.response?.data?.message || "An error occurred");
            console.log("Error in Signing-up", error);
        } finally {
            // Reset
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/sign_in", data);

            const authHeaders = {
                "access-token": res.headers["access-token"],
                client: res.headers["client"],
                expiry: res.headers["expiry"],
                uid: res.headers["uid"]
            };
            // login if only all credentials are present
            if (Object.values(authHeaders).some(value => !value)) {
                throw new Error("Missing authentication headers");
            }
            // loop through object to store authheaders in local
            Object.entries(authHeaders).forEach(([key, value]) => localStorage.setItem(key, value));
            localStorage.setItem("user_info", JSON.stringify(res.data.data));

            set({ authUser: res.data.data });
            toast.success("Logged in Successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during login");
            console.error("Error logging in", error);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            // Remove local storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_info');

            // Update state
            set({ authUser: null });
            toast.success("Logged Out Successfully!");

        } catch (error) {
            toast.error("An error occurred during logout");
            console.log("Error in Logging out", error);
        }
    },
})); 