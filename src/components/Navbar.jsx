import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { LogOut, MessageSquare, User, Users, Users2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';



const Navbar = () => {

    const { logout, authUser } = useAuthStore();

    return (
        <header className='bg-sky-950  border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80'>
            <div className='container mx-auto px-4 h-16'>
                <div className='flex justify-between gap-8 h-full'>
                    <div className='flex items-center gap-8'>
                        <Link to='/' className='flex items-center gap-2.5 hover:opacity-80 transition-all'>
                            <div className='w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center'>
                                <MessageSquare className='w-5 h-5 text-white' />
                            </div>
                            <h1 className='text-2xl font-bold text-white'>SnoreSlack</h1>
                        </Link>
                    </div>

                    <div className='flex items-center gap-2'>
                        <Link to={'/settings'} className={'btn btn-sm gap-2 transition-colors'}>
                            <Settings className='w-4 h-4' />
                            <span className='hidden sm:inline'>Settings</span>
                        </Link>

                        {authUser && (
                            <>
                                <Link to={"/channel"} className={`btn btn-sm gap-2`}>
                                    <Users className="size-5" />
                                    <span className="hidden sm:inline">Channel</span>
                                </Link>
                                <button className='btn btn-sm flex gap-2 items-center' onClick={logout}>
                                    <LogOut className='size-5' />
                                    <span className='hidden sm:inline'>Logout</span>
                                </button>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar