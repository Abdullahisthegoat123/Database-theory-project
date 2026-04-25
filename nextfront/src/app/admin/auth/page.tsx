"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminAuthPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    async function handleSignup() {
        setError("");
        setLoading(true);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name }
            }
        });

        console.log(data, error);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        const user = data.user;
        if (!user) {
            console.error("Login failed: no user returned");
            return;
        }

        console.log(user);

        // Insert profile row manually
        await supabase.from("profiles").insert({
            id: user.id, // 'data.user' is possibly 'null'.ts(18047)

            name,
            is_admin: false
        });

        setLoading(false);

        // redirect or show success
        window.location.href = "/";
    }
    async function handleLogin() {
        setError("");
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setLoading(false);
        window.location.href = "/";
    }
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="mt-70 min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-zinc-950 py-20 px-4">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
            <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-red-500/10 rounded-full blur-[100px] animate-pulse delay-2000" />

            {/* Glassmorphic Card */}
            <div className="relative z-10 w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="p-8 pb-0 text-center">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 bg-clip-text text-transparent mb-2">
                            Admin Portal
                        </h1>
                        <p className="text-zinc-400 text-sm">
                            {isLogin
                                ? "Welcome back! Please login to continue."
                                : "Create an account to manage the platform."}
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8 pt-6">
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            {!isLogin && (
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-300 ml-1">
                                        Full Name
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            value={name}

                                            onChange={(e) => setName(e.target.value)}

                                            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-300 ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@cricmate.com"
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-300 ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {!isLogin && (
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-300 ml-1">
                                        Confirm Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                onClick={isLogin ? handleLogin : handleSignup}

                                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all duration-200 mt-2"
                            >
                                {isLogin ? "Sign In" : "Create Account"}
                            </button>
                        </form>

                        {/* Toggle */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-zinc-400">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                                >
                                    {isLogin ? "Sign up" : "Log in"}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
