import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Users, Send } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useChatStore } from '../store/useChatStore';
import { axiosInstance } from '../lib/axios';
import { saveToLocalStorage, getItemFromLocalStorage } from '../lib/localStorage';

const Channel = () => {
    const [channelName, setChannelName] = useState("");
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [userId, setUserId] = useState("");
    const { theme } = useThemeStore();
    const { channels, getChannels, createChannel } = useChatStore();

    useEffect(() => {
        getChannels();
    }, []); // Ensure getChannels runs on mount

    useEffect(() => {
        if (Array.isArray(channels) && channels.length > 0) {
            saveToLocalStorage("channels", channels);
        }
    }, [channels]); // Save channels to localStorage when they change

    const handleCreateChannel = async () => {
        if (!channelName.trim()) return;
        await createChannel(channelName);
        setChannelName("");
        await getChannels(); // Fetch updated channels list
    };

    const handleAddUserToChannel = async () => {
        if (!selectedChannel || !userId.trim()) return;
        try {
            console.log("Adding user to channel:", selectedChannel, "User ID:", userId);
            await axiosInstance.post("/channel/add_member", {
                id: selectedChannel,
                member_id: userId
            }, {
                headers: {
                    "access-token": localStorage.getItem("access-token"),
                    "client": localStorage.getItem("client"),
                    "expiry": localStorage.getItem("expiry"),
                    "uid": localStorage.getItem("uid"),
                }
            });
            alert("User added successfully");
            setUserId("");
        } catch (error) {
            console.error("Error adding user to channel:", error);
            alert("Failed to add user");
        }
    };

    return (
        <div className={`h-screen bg-${theme} text-white flex flex-col justify-center items-center p-6 md:p-12`}>
            <div className='w-full max-w-md space-y-8'>
                <div className='space-y-6'>
                    <h2 className='text-xl font-semibold'>Create Channel</h2>
                    <div className='flex gap-2'>
                        <input
                            type="text"
                            className='input input-bordered w-full text-black'
                            placeholder='Enter channel name'
                            value={channelName}
                            onChange={(e) => setChannelName(e.target.value)}
                        />
                        <button onClick={handleCreateChannel} className='btn btn-accent flex items-center gap-1'>
                            <Plus className='h-5 w-5' /> Create
                        </button>
                    </div>
                </div>
                <div className='space-y-6'>
                    <h2 className='text-xl font-semibold'>Existing Channels</h2>
                    <ul className='space-y-2'>
                        {Array.isArray(channels) && channels.length > 0 ? (
                            channels.map((channel, index) => (
                                <li key={channel.id || `channel-${index}`} className='bg-primary/20 p-2 rounded-lg'>
                                    {channel.name}
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-400">No channels available</li>
                        )}
                    </ul>
                </div>
                <div className='space-y-6'>
                    <h2 className='text-xl font-semibold'>Add User to Channel</h2>
                    <select
                        onChange={(e) => setSelectedChannel(e.target.value)}
                        className='select select-bordered w-full text-black'>
                        <option value="">Select a Channel</option>
                        {Array.isArray(channels) && channels.map((channel, index) => (
                            <option key={channel.id || `channel-option-${index}`} value={channel.id}>{channel.name}</option>
                        ))}
                    </select>
                    <div className='flex gap-2'>
                        <input
                            type="text"
                            className='input input-bordered w-full text-black'
                            placeholder='Enter user ID'
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                        <button onClick={handleAddUserToChannel} className='btn btn-accent flex items-center gap-1'>
                            <Plus className='h-5 w-5' /> Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Channel;









