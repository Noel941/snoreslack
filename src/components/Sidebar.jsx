import React, { useState, useEffect } from 'react';
import { Users, Hash } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import avatar from '../image/avatar.png';

const Sidebar = () => {
    const { getUsers, users = [], selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
    const { getChannels, channels = [], setSelectedChannel, selectedChannel } = useChatStore();
    const [activeTab, setActiveTab] = useState('contacts');

    useEffect(() => {
        getUsers();
        getChannels();
    }, []);

    return (
        <aside className='h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
            <div className='border-b border-base-300 w-full p-5 flex gap-4'>
                <button
                    className={`flex items-center gap-2 ${activeTab === 'contacts' ? 'text-primary' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('contacts')}>
                    <Users className='size-6' />
                    <span className='font-medium hidden lg:block'>Contacts</span>
                </button>
                <button
                    className={`flex items-center gap-2 ${activeTab === 'channels' ? 'text-primary' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('channels')}>
                    <Hash className='size-6' />
                    <span className='font-medium hidden lg:block'>Channels</span>
                </button>
            </div>

            {activeTab === 'contacts' && (
                <div className="overflow-y-auto w-full py-3">
                    {users.length === 0 ? (
                        <div className="text-center text-gray-500">No users found. Try refreshing.</div>
                    ) : (
                        users.map((user, index) => (
                            <button
                                key={user._id || index}
                                onClick={() => setSelectedUser(user)}
                                className={`w-full p-3 flex items-center gap-3 hover:bg-primary transition-colors ${selectedUser?._id === user._id ? "bg-base-300 text-primary-content ring-2 ring-primary" : ""}`}
                            >
                                <div className="relative mx-auto lg:mx-0">
                                    <img src={avatar} alt={user.email} className="size-12 object-cover rounded-full" />
                                </div>
                                <div className="hidden lg:block text-left min-w-0">
                                    <div className="font-medium truncate">{user.email}</div>
                                    <div className="text-sm text-zinc-400">Offline</div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'channels' && (
                <div className="overflow-y-auto w-full py-3">
                    {channels.length === 0 ? (
                        <div className="text-center text-gray-500">No channels found. Create one in the Channels Page.</div>
                    ) : (
                        channels.map((channel) => (
                            <button
                                key={channel.id}
                                onClick={() => setSelectedChannel(channel.id)}
                                className={`w-full p-3 flex items-center gap-3 hover:bg-primary transition-colors ${selectedChannel === channel.id ? "bg-base-300 text-primary-content ring-2 ring-primary" : ""}`}
                            >
                                <div className="relative mx-auto lg:mx-0">
                                    <Hash className="size-6 text-gray-400" />
                                </div>
                                <div className="hidden lg:block text-left min-w-0">
                                    <div className="font-medium truncate">{channel.name}</div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
