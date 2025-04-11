import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import { useTheme } from '@/components/ThemeProvider';
import { useEffect, useState } from 'react';

export default function AuthLayout({ 
    children, 
    title, 
    description, 
    ...props 
}: { 
    children: React.ReactNode; 
    title: string; 
    description: string;
    [key: string]: any;
}) {
    const { ThemeToggle } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Set mounted state after initial render
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            {/* Fixed position theme toggle */}
            <div className="fixed top-5 right-5 z-[100] bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-1 rounded-full shadow-lg">
                {mounted ? (
                    <ThemeToggle className="shadow-lg" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
                )}
            </div>
            
            <AuthLayoutTemplate 
                title={title} 
                description={description} 
                {...props}
            >
                {children}
            </AuthLayoutTemplate>
        </>
    );
}