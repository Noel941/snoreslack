import React from 'react';
import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import avatar from '../image/avatar.png'
import { useAuthStore } from '../store/useAuthStore';

const ChatContainer = () => {

    const { messages, getMessages, isMessagesLoading, selectedUser } = useChatStore();
    const { authUser } = useAuthStore;

    useEffect(() => {
        getMessages(selectedUser._id)
    }, [selectedUser._id, getMessages])

    if (isMessagesLoading) {
        return (
            <div className='flex-1 flex flex-col overflow-auto'>
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className='flex-1 flex flex-col overflow-auto'>
            <ChatHeader />

            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {Array.isArray(messages) && messages.length > 0 ? (
                    messages.map((message) => {
                        console.log("Processing message:", message);


                        const isSentByCurrentUser = message.sender_id === authUser?.id;

                        return (
                            <div key={message.id} className={`chat ${isSentByCurrentUser ? "chat-end" : "chat-start"}`}>
                                <div className='chat-image avatar'>
                                    <div className='size-10 rounded-full border'>
                                        <img src={avatar} alt="profile picture" />
                                    </div>
                                </div>
                                <div className='chat-header mb-1'>
                                    <span className="text-xs font-bold">{isSentByCurrentUser ? "You" : "Unknown User"}</span>
                                    <time className='text-xs opacity-50 ml-1'>
                                        {new Date(message.created_at).toLocaleTimeString()}
                                    </time>
                                </div>
                                <div className="chat-bubble">{message.body}</div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-500">No messages found</p>
                )}
            </div>

            <MessageInput />
        </div>
    );
};

export default ChatContainer;