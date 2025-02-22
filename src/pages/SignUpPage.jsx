import React from 'react'
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, Loader2, MessageSquare } from 'lucide-react';
import { User } from 'lucide-react';
import { Lock } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import snoreslackImage from '../image/snoreslack.png'
import axios from 'axios';
import toast from 'react-hot-toast';

const SignUpPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        password_confirmation: "",
    });

    const { signup, isSigningUp } = useAuthStore();


    // if user does not input all fields then return error
    const validateForm = () => {
        if (!formData.email.trim()) return toast.error("Email is Required!");
        // use regular expression to check for invalid email format
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid Email Format!");
        if (!formData.password) return toast.error("Password is Required!");
        if (!formData.password_confirmation) return toast.error("Password did not Match!");

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // check data if valid
        const success = validateForm();

        if (success === true) signup(formData);
    };

    return (
        <div className='min-h-screen grid lg:grid-cols-2 bg-sky-950 text-white'>

            {/* left side */}

            < div className='flex flex-col justify-center items-center p-6 sm:p-12' >
                <img src={snoreslackImage} alt="logo" className='w-full max-w-xlg space-y-8' />
            </div >

            {/* right side */}

            <div className='flex flex-col justify-center items-center p-6 sm:p-12'>

                <div className='w-full max-w-md space-y-8'>

                    <div className='text-center mb-8'>
                        <div className='flex flex-col items-center gap-2 group'>
                            <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                                <MessageSquare className='size-6 text-white' />
                            </div>
                            <h1 className='text-2xl font-bold mt-2'>Create an Account</h1>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-6'>

                        <div className='form-control'>
                            <label htmlFor="email" className="label">
                                <span className='label-text font-medium text-white'>Email</span>
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <User className='size-5 text-base-content/40' />
                                </div>
                                <input
                                    type="email"
                                    id='email'
                                    className={'input input-bordered w-full pl-10 text-black'}
                                    placeholder='Email'
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className='form-control'>
                            <label htmlFor="password" className="label">
                                <span className='label-text font-medium text-white'>Password</span>
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Lock className='size-5 text-base-content/40' />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id='password'
                                    className={'input input-bordered w-full pl-10 text-black'}
                                    placeholder='Password'
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}

                                />
                                <button
                                    type='button'
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                                    onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <EyeOff className='size-5 text-base-content/40' />
                                    ) : (<Eye className='size-5 text-base-content/40' />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className='form-control'>
                            <label htmlFor="password_confirmation" className="label">
                                <span className='label-text font-medium text-white'>Confirm Password</span>
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Lock className='size-5 text-base-content/40' />
                                </div>
                                <input
                                    type={showPasswordConfirmation ? "text" : "password"}
                                    id='password_confirmation'
                                    className={'input input-bordered w-full pl-10 text-black'}
                                    placeholder='Confirm Password'
                                    value={formData.password_confirmation}
                                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}

                                />
                                <button
                                    type='button'
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}>
                                    {showPasswordConfirmation ? (
                                        <EyeOff className='size-5 text-base-content/40' />
                                    ) : (<Eye className='size-5 text-base-content/40' />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type='submit' className='btn btn-glass btn-outline btn-accent w-full' disabled={isSigningUp}>
                            {isSigningUp ? (
                                <>
                                    <Loader2 className='size-5 animate-spin text-white' />
                                    Loading...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                    </form>

                    <div className='text-center text-white border-white'>
                        <p>
                            Already have an account? {" "}
                            <Link to="/login" className='link link-accent'>
                                Sign In!
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div >

    );
};

export default SignUpPage;


