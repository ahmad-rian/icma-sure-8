import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface Props {
    message: string;
}

export default function AccessDenied({ message }: Props) {
    return (
        <>
            <Head title="Akses Ditolak" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Akses Ditolak
                    </h1>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <Button 
                        onClick={() => window.location.href = '/'}
                        className="w-full"
                    >
                        Kembali ke Beranda
                    </Button>
                </div>
            </div>
        </>
    );
}