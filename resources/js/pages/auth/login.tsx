import { Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Separator } from '@/components/ui/separator';

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

            <div className="flex flex-col gap-8 max-w-md mx-auto w-full">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 z-0"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-amber-500/20 to-red-500/20 rounded-full blur-2xl translate-x-1/4 translate-y-1/4 z-0"></div>
                
                
                
                {/* Login card */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl border-t border-slate-200 dark:border-slate-700 relative z-10">
                    <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-white">Sign in to your account</h2>
                    <p className="text-center text-slate-600 dark:text-slate-400 mb-8">Use your Google account to access the conference platform</p>
                    
                    {/* Google Login Button */}
                    <Button 
                        type="button" 
                        onClick={handleGoogleLogin}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg font-medium"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Sign in with Google
                    </Button>

                    {/* Information text */}
                    <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        By signing in, you agree to the conference's terms and conditions
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center text-sm font-medium text-red-600 dark:text-red-400">
                            {status}
                        </div>
                    )}
                </div>

                {/* Quote card */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-lg shadow-xl border border-slate-700 mb-4 relative z-10">
                    <blockquote className="italic text-slate-200 mb-2">"{quote.text}"</blockquote>
                    <p className="text-right text-slate-400 text-sm">— {quote.author}</p>
                </div>
                
                {/* Footer */}
                <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                    Need help? Contact <a href="mailto:icmasure.lppm@unsoed.com" className="text-blue-600 hover:underline dark:text-blue-400">icmasure.lppm@unsoed.com</a>
                </div>
            </div>
        </AuthLayout>
    );
}