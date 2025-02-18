import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { getStoredAuthDetails } from "../lib/localStorage";
import { useAuthStore } from '../store/useAuthStore'
import { data } from "react-router-dom";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    channels: [],
    selectedUser: null,
    selectedChannel: null,

    setSelectedUser: (user) => set({ selectedUser: user }),
    setSelectedChannel: (channelId) => set({ selectedChannel: channelId }),

    isUsersLoading: false,
    isChannelsLoading: false,

    getChannels: async () => {
        set({ isChannelsLoading: true });

        try {
            const authDetails = getStoredAuthDetails();
            if (!authDetails) {
                console.error("Auth details are missing.");
                set({ channels: [] });
                return;
            }

            const res = await axiosInstance.get("/channels", {
                headers: {
                    "Content-Type": "application/json",
                    "access-token": authDetails.accessToken,
                    client: authDetails.client,
                    expiry: authDetails.expiry,
                    uid: authDetails.uid,
                }
            });

            if (Array.isArray(res.data?.data)) {
                set({ channels: res.data.data });
                saveToLocalStorage("channels", res.data.data);
            } else {
                set({ channels: [] });
            }
        } catch (error) {
            set({ channels: getItemFromLocalStorage("channels") || [] });
        } finally {
            set({ isChannelsLoading: false });
        }
    },

    createChannel: async (channelName) => {
        try {
            if (!channelName.trim()) return;
            const authDetails = getStoredAuthDetails();
            if (!authDetails) return;

            const res = await axiosInstance.post("/channels", { name: channelName }, {
                headers: {
                    "Content-Type": "application/json",
                    "access-token": authDetails.accessToken,
                    client: authDetails.client,
                    expiry: authDetails.expiry,
                    uid: authDetails.uid,
                }
            });

            if (res.data) {
                set((state) => ({ channels: [...state.channels, res.data] }));
            }
        } catch (error) {
            console.error("Error creating channel:", error);
        }
    },

    getUsers: async () => {

        const accessToken = localStorage.getItem("access-token");
        const client = localStorage.getItem("client");
        const expiry = localStorage.getItem("expiry");
        const uid = localStorage.getItem("uid");

        if (!accessToken || !client || !expiry || !uid) {
            console.error("Auth details are missing or invalid.");
            toast.error("Authentication details are missing.");
            return;
        }

        set({ isUsersLoading: true });

        try {
            const res = await axiosInstance.get("/users", {
                headers: {
                    "Content-Type": "application/json",
                    "access-token": accessToken,
                    client: client,
                    expiry: expiry,
                    uid: uid,
                }
            });

            console.log("Full API Response:", res.data);

            if (res.data && Array.isArray(res.data.data)) {
                //  Use res.data.data because API returns users in data not inside users 
                set({ users: res.data.data });
                console.log("Users fetched successfully:", res.data.data);
            } else {
                console.error("No users array found in response!", res.data);
                toast.error("No users found in the response.");
                set({ users: [] });
            }
        } catch (error) {
            console.error("Error fetching users:", error.response?.data || error.message);

            if (error.response && error.response.status === 401) {
                toast.error("Unauthorized access. Please check your authentication details.");
            } else {
                const errorMessage = error?.response?.data?.message || "An error occurred";
                toast.error(errorMessage);
            }

            set({ users: [] });
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async () => {
        set({ isMessagesLoading: true });

        const { selectedUser } = get();
        if (!selectedUser) {
            console.error("No user selected.");
            set({ messages: [] });
            return;
        }

        const authDetails = getStoredAuthDetails();
        if (!authDetails) {
            toast.error("Authentication details are missing.");
            set({ messages: [] });
            return;
        }

        try {
            const res = await axiosInstance.get("/messages", {
                params: {
                    receiver_id: selectedUser.id,
                    receiver_class: "User",
                },
                headers: {
                    "Content-Type": "application/json",
                    "access-token": authDetails.accessToken,
                    client: authDetails.client,
                    expiry: authDetails.expiry,
                    uid: authDetails.uid,
                },
            });

            console.log("Full API Response:", res.data);

            // extract messages
            let messagesArray = res.data?.data;
            // wrap in array
            if (!Array.isArray(messagesArray)) {
                messagesArray = [messagesArray];
            }

            console.log("Extracted Messages:", messagesArray);

            set({ messages: messagesArray });

        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error(error.response?.data?.message || "Failed to retrieve messages.");
            set({ messages: [] });
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessages: async (messageBody) => {
        const { selectedUser } = get();

        if (!selectedUser) {
            toast.error("No user selected.");
            return;
        }

        const authDetails = getStoredAuthDetails();
        if (!authDetails) {
            toast.error("Authentication details are missing.");
            return;
        }

        try {
            const res = await axiosInstance.post("/api/v1/messages", {
                receiver_id: selectedUser.id,
                receiver_class: "User",
                body: messageBody,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "access-token": authDetails.accessToken,
                    client: authDetails.client,
                    expiry: authDetails.expiry,
                    uid: authDetails.uid,
                }
            });

            console.log("Message sent:", res.data);

            // Ensure messages is always an array before updating
            set((state) => ({ messages: [...(Array.isArray(state.messages) ? state.messages : []), res.data] }));

        } catch (error) {
            console.error("Failed to send message:", error);
            toast.error(error.response?.data?.message || "Failed to send message.");
        }
    },

}));