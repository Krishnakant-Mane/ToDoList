import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import supabase from '../supabase-client';

export const Auth = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register: registerSignUp,
        handleSubmit: handleSubmitSignUp,
        formState: { errors: errorsSignUp },
        reset: resetSignUp,
    } = useForm();

    const {
        register: registerSignIn,
        handleSubmit: handleSubmitSignIn,
        formState: { errors: errorsSignIn },
        reset: resetSignIn,
    } = useForm();

    const onSignUp = async (data) => {
        setLoading(true);
        console.log('Sign Up Data:', data);

        const { error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
        })
        if(error){
            console.log(error);
        }else{
            alert("Account created successfully")
        }
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            resetSignUp();
            setIsLogin(true); // Switch to login after successful signup
        }, 1500);

    };

    const onSignIn = async (data) => {

        setLoading(true);
        console.log('Sign In Data:', data);
        
        const {error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        })
        if(error){
            console.log(error);
        }else{
            alert("Login successfully")
        }
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            resetSignIn();
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 font-sans text-slate-800">
            {/* Header / Branding */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-cursive font-bold text-slate-800 mb-2" style={{ fontFamily: '"Dancing Script", cursive' }}>
                    My Task Journal
                </h1>
                <p className="text-slate-500 text-sm tracking-wide">ORGANIZE YOUR THOUGHTS & TASKS</p>
            </div>

            {/* Auth Card */}
            <div className="w-full max-w-md bg-white rounded-lg shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] p-8 border border-slate-100 relative overflow-hidden">
                {/* Decorative Top Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-rose-200 via-teal-200 to-indigo-200"></div>

                {/* Dynamic Title */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">
                        {isLogin ? 'Welcome Back' : 'Create an Account'}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        {isLogin ? 'Pick up where you left off' : 'Start your journal today'}
                    </p>
                </div>

                {/* Form Container */}
                <div className="transition-all duration-300 ease-in-out">
                    {isLogin ? (
                        /* LOGIN FORM */
                        <form onSubmit={handleSubmitSignIn(onSignIn)} className="space-y-5">
                            <div className="relative group">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                                    <input
                                        type="email"
                                        {...registerSignIn('email', { required: 'Email is required' })}
                                        placeholder="your@email.com"
                                        className="w-full pl-6 pr-4 py-2 bg-transparent border-b border-slate-200 focus:border-slate-800 outline-none transition-colors placeholder:text-slate-300 text-slate-700"
                                    />
                                </div>
                                {errorsSignIn.email && <span className="text-xs text-rose-500 mt-1">{errorsSignIn.email.message}</span>}
                            </div>

                            <div className="relative group">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                                    <input
                                        type="password"
                                        {...registerSignIn('password', { required: 'Password is required' })}
                                        placeholder="••••••••"
                                        className="w-full pl-6 pr-4 py-2 bg-transparent border-b border-slate-200 focus:border-slate-800 outline-none transition-colors placeholder:text-slate-300 text-slate-700"
                                    />
                                </div>
                                {errorsSignIn.password && <span className="text-xs text-rose-500 mt-1">{errorsSignIn.password.message}</span>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 rounded shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2 mt-6"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Login</span> <ArrowRight className="w-4 h-4" /></>}
                            </button>

                            <div className="text-center mt-4">
                                <a href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Forgot your password?</a>
                            </div>
                        </form>
                    ) : (
                        /* SIGN UP FORM */
                        <form onSubmit={handleSubmitSignUp(onSignUp)} className="space-y-5">

                            <div className="relative group">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                                    <input
                                        type="email"
                                        {...registerSignUp('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        placeholder="your@email.com"
                                        className="w-full pl-6 pr-4 py-2 bg-transparent border-b border-slate-200 focus:border-slate-800 outline-none transition-colors placeholder:text-slate-300 text-slate-700"
                                    />
                                </div>
                                {errorsSignUp.email && <span className="text-xs text-rose-500 mt-1">{errorsSignUp.email.message}</span>}
                            </div>

                            <div className="relative group">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                                    <input
                                        type="password"
                                        {...registerSignUp('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters"
                                            }
                                        })}
                                        placeholder="••••••••"
                                        className="w-full pl-6 pr-4 py-2 bg-transparent border-b border-slate-200 focus:border-slate-800 outline-none transition-colors placeholder:text-slate-300 text-slate-700"
                                    />
                                </div>
                                {errorsSignUp.password && <span className="text-xs text-rose-500 mt-1">{errorsSignUp.password.message}</span>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 rounded shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2 mt-6"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Sign Up</span> <ArrowRight className="w-4 h-4" /></>}
                            </button>
                        </form>
                    )}
                </div>

                {/* Toggle Mode */}
                <div className="mt-8 text-center pt-6 border-t border-slate-50">
                    <p className="text-sm text-slate-400">
                        {isLogin ? "New here? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-bold text-slate-600 hover:text-slate-800 hover:underline transition-all"
                        >
                            {isLogin ? 'Create an account' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="mt-12 opacity-50">
                <p className="font-cursive text-slate-400 text-xl" style={{ fontFamily: '"Dancing Script", cursive' }}>My Task Journal</p>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
      `}</style>
        </div>
    );
};
