import React from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
    const { selectedUser } = useChatStore();
    const { authUser } = useAuthStore();

    return (
        <div className='h-screen bg-base-200 relative'>
            <div className='flex items-center justify-center pt-20 px-4'>
                <div className='bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]'>
                    <div className='flex h-full rounded-lg overflow-hidden'>
                        <Sidebar />
                        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
                    </div>
                </div>
            </div>

            {/* User Info Display */}
            {authUser && (
                <div className='absolute bottom-4 left-4 bg-base-300 p-3 rounded-lg shadow-md'>
                    <p className='text-sm font-semibold'>User ID: {authUser.id}</p>
                    <p className='text-sm text-gray-500'>Email: {authUser.email}</p>
                </div>
            )}
        </div>
    );
};

export default HomePage;