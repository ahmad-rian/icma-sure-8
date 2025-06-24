import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

// Array of inspiring quotes about research and academia
const quotes = [
    {
        text: "Research is creating new knowledge.",
        author: "Neil Armstrong"
    },
    {
        text: "The true sign of intelligence is not knowledge but imagination.",
        author: "Albert Einstein"
    },
    {
        text: "Science knows no country, because knowledge belongs to humanity.",
        author: "Louis Pasteur"
    },
    {
        text: "Research is to see what everybody else has seen, and to think what nobody else has thought.",
        author: "Albert Szent-Györgyi"
    },
    {
        text: "The best way to predict the future is to create it.",
        author: "Peter Drucker"
    }
];

export default function Login({ status, canResetPassword }: LoginProps) {
    // State for random quote
    const [quote, setQuote] = useState(quotes[0]);
    
    // Google login handler
    const handleGoogleLogin = () => {
        window.location.href = route('login.google');
    };

    // Set random quote on page load
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
    }, []);

    return (
        <AuthLayout title="Welcome to ICMA SURE" description="International Conference on Multidiscipline Approaches for Sustainable Rural Development">
            <Head title="Log in" />

            {/* Animated background with modern geometric shapes */}
            <div className="fixed inset-0 z-0 opacity-50">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 -right-48 w-96 h-96 bg-gradient-to-tl from-amber-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-24 left-1/4 w-80 h-80 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="flex flex-col gap-8 max-w-md mx-auto w-full pt-8 relative z-10">
                {/* Login card with glassmorphism effect */}
                <div className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 p-8 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 relative z-10 transition-all duration-300 hover:shadow-blue-500/5">
                    <h2 className="text-2xl font-bold text-center mb-2 text-slate-800 dark:text-white">Welcome Back</h2>
                    <p className="text-center text-slate-600 dark:text-slate-400 mb-8">Sign in to access the conference platform</p>
                    
                    {/* Modern Google Login Button with hover animation */}
                    <Button 
                        type="button" 
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 py-6 px-4 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
                    >
                        {/* Google G Logo */}
                        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span className="font-medium">Continue with Google</span>
                    </Button>

                    {/* Information text */}
                    <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        Dengan masuk, Anda setuju dengan 
                        <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 mx-1 hover:underline">syarat</a>
                        dan
                        <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 mx-1 hover:underline">kebijakan privasi</a>
                        konferensi
                    </div>

                    {/* Status Message with improved styling */}
                    {status && (
                        <div className={`mt-4 p-4 border-l-4 rounded-r-lg text-sm font-medium animate-fadeIn ${
                            status.includes('berhasil') || status.includes('success') || status.includes('Selamat')
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-400 text-green-600 dark:text-green-400'
                                : 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-400 text-red-600 dark:text-red-400'
                        }`}>
                            <div className="flex items-center">
                                {status.includes('berhasil') || status.includes('success') || status.includes('Selamat') ? (
                                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {status}
                            </div>
                        </div>
                    )}

                    {/* Info untuk user baru */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                            </svg>
                            <div>
                                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                    Info Login
                                </h4>
                                <p className="text-xs text-blue-700 dark:text-blue-200">
                                    Pengguna baru akan otomatis didaftarkan saat login pertama kali dengan Google.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quote card with modern glassmorphism design */}
                <div className="backdrop-blur-md bg-gradient-to-r from-slate-800/95 to-slate-900/95 p-7 rounded-xl shadow-xl border border-slate-700/50 mb-4 relative z-10 transform transition-all hover:scale-[1.01] duration-300">
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
                    <div>Butuh bantuan? Hubungi <a href="mailto:icmasure.lppm@unsoed.com" className="text-blue-600 hover:underline dark:text-blue-400 font-medium">icmasure.lppm@unsoed.com</a></div>
                </div>
            </div>
        </AuthLayout>
    );
}