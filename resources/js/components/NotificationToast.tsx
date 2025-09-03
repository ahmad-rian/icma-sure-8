import React, { useEffect, useState } from 'react';
import { X, CheckCircle, Clock, FileText, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentNotification {
    id: string;
    submission: {
        id: string;
        title: string;
        user: {
            name: string;
            email: string;
        };
    };
    amount: number;
    updated_at: string;
}

interface NotificationToastProps {
    notifications: PaymentNotification[];
    onDismiss: (id: string) => void;
    onViewSubmission: (submissionId: string) => void;
}

export default function NotificationToast({ 
    notifications, 
    onDismiss, 
    onViewSubmission 
}: NotificationToastProps) {
    const [visibleNotifications, setVisibleNotifications] = useState<PaymentNotification[]>([]);

    useEffect(() => {
        // Show new notifications with animation
        notifications.forEach((notification, index) => {
            setTimeout(() => {
                setVisibleNotifications(prev => {
                    if (!prev.find(n => n.id === notification.id)) {
                        return [...prev, notification];
                    }
                    return prev;
                });
            }, index * 200); // Stagger animations
        });
    }, [notifications]);

    const handleDismiss = (id: string) => {
        setVisibleNotifications(prev => prev.filter(n => n.id !== id));
        setTimeout(() => onDismiss(id), 300); // Wait for animation
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Baru saja';
        if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} jam yang lalu`;
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    if (visibleNotifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {visibleNotifications.map((notification) => (
                <div
                    key={notification.id}
                    className={cn(
                        "bg-white border border-green-200 rounded-lg shadow-lg p-4",
                        "transform transition-all duration-300 ease-in-out",
                        "animate-in slide-in-from-right-full"
                    )}
                >
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <FileText className="w-4 h-4 text-green-600" />
                            </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-medium text-green-800">
                                    Bukti Pembayaran Baru
                                </span>
                            </div>
                            
                            <p className="text-sm text-gray-900 font-medium truncate" title={notification.submission.title}>
                                {notification.submission.title}
                            </p>
                            
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                                <User className="w-3 h-3" />
                                <span className="truncate">{notification.submission.user.name}</span>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs font-medium text-green-700">
                                    {formatAmount(notification.amount)}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {formatTime(notification.updated_at)}
                                </span>
                            </div>
                            
                            <button
                                onClick={() => onViewSubmission(notification.submission.id)}
                                className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Lihat Detail →
                            </button>
                        </div>
                        
                        <button
                            onClick={() => handleDismiss(notification.id)}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}