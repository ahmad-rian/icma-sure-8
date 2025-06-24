import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

interface RegisterProps {
    status?: string;
}

// Array of inspiring quotes about research and academia
const quotes = [
    {
        text: "The journey of a thousand miles begins with one step.",
        author: "Lao Tzu"
    },
    {
        text: "Education is the most powerful weapon which you can use to change the world.",
        author: "Nelson Mandela"
    },
    {
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs"
    },
    {
        text: "The future belongs to those who learn more skills and combine them in creative ways.",
        author: "Robert Greene"
    },
    {
        text: "Knowledge is power. Information is liberating.",
        author: "Kofi Annan"
    }
];

export default function Register({ status }: RegisterProps) {
    // State for random quote
    const [quote, setQuote] = useState(quotes[0]);
    
    // Google register handler
    const handleGoogleRegister = () => {
        window.location.href = route('register.google');
    };

    // Set random quote on page load
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
    }, []);

    return (
        <AuthLayout title="Join ICMA SURE" description="Register to participate in International Conference on Multidiscipline Approaches for Sustainable Rural Development">
            <Head title="Register" />

            {/* Animated background with modern geometric shapes */}
            <div className="fixed inset-0 z-0 opacity-50">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 -right-48 w-96 h-96 bg-gradient-to-tl from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-24 left-1/4 w-80 h-80 bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="flex flex-col gap-8 max-w-md mx-auto w-full pt-8 relative z-10">
                {/* Register card with glassmorphism effect */}
                <div className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 p-8 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 relative z-10 transition-all duration-300 hover:shadow-green-500/5">
                    <div className="text-center mb-6">
                        {/* Welcome icon */}
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Join ICMA SURE</h2>
                        <p className="text-slate-600 dark:text-slate-400">Create your account to participate in the conference</p>
                    </div>
                    
                    {/* Modern Google Register Button with hover animation */}
                    <Button 
                        type="button" 
                        onClick={handleGoogleRegister}
                        className="w-full flex items-center justify-center gap-3 py-6 px-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl"
                    >
                        {/* Google G Logo */}
                        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
                        </svg>
                        <span className="font-medium">Register with Google</span>
                    </Button>

                    {/* Benefits section */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200/50 dark:border-green-700/50">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            What you'll get:
                        </h4>
                        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 ml-6">
                            <li>• Access to conference materials and presentations</li>
                            <li>• Networking opportunities with researchers</li>
                            <li>• Certificate of participation</li>
                            <li>• Updates on upcoming events</li>
                        </ul>
                    </div>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            Sudah punya akun?
                        </p>
                        <Link 
                            href={route('login')}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-medium rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            Login ke Akun
                        </Link>
                    </div>

                    {/* Information text */}
                    <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        By registering, you agree to the conference's 
                        <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 mx-1 hover:underline">terms</a>
                        and
                        <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 mx-1 hover:underline">privacy policy</a>
                    </div>

                    {/* Status Message with improved styling */}
                    {status && (
                        <div className={`mt-4 p-4 border-l-4 rounded-r-lg text-sm font-medium animate-fadeIn ${
                            status.includes('error') || status.includes('sudah terdaftar') || status.includes('gagal')
                                ? 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-400 text-red-600 dark:text-red-400'
                                : 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-400 text-green-600 dark:text-green-400'
                        }`}>
                            <div className="flex items-center">
                                {status.includes('error') || status.includes('sudah terdaftar') || status.includes('gagal') ? (
                                    <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {status}
                            </div>
                        </div>
                    )}
                </div>

                {/* Quote card with modern glassmorphism design */}
                <div className="backdrop-blur-md bg-gradient-to-r from-green-800/95 to-blue-800/95 p-7 rounded-xl shadow-xl border border-green-700/50 mb-4 relative z-10 transform transition-all hover:scale-[1.01] duration-300">
                    <div className="absolute top-0 right-0 p-2 opacity-20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                        </svg>
                    </div>
                    <blockquote className="italic text-slate-200 mb-3 text-lg">"{quote.text}"</blockquote>
                    <p className="text-right text-slate-400 text-sm font-medium">— {quote.author}</p>
                </div>
                
                {/* Footer with improved styling */}
                <div className="text-center text-sm text-slate-500 dark:text-slate-400 mb-8 flex flex-col gap-2">
                    <div>Need help? Contact <a href="mailto:icmasure.lppm@unsoed.com" className="text-blue-600 hover:underline dark:text-blue-400 font-medium">icmasure.lppm@unsoed.com</a></div>
                </div>
            </div>
        </AuthLayout>
    );
}