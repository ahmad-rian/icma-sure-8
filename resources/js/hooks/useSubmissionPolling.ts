import { useState, useEffect, useCallback, useRef } from 'react';
import { router } from '@inertiajs/react';

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

interface PollingResponse {
    submissions: any[];
    recent_payments: PaymentNotification[];
    timestamp: string;
    has_updates: boolean;
}

interface UseSubmissionPollingOptions {
    enabled?: boolean;
    interval?: number; // in milliseconds
    onNewPayments?: (payments: PaymentNotification[]) => void;
}

export function useSubmissionPolling({
    enabled = true,
    interval = 30000, // 30 seconds default
    onNewPayments
}: UseSubmissionPollingOptions = {}) {
    const [notifications, setNotifications] = useState<PaymentNotification[]>([]);
    const [isPolling, setIsPolling] = useState(false);
    const [lastCheck, setLastCheck] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const mountedRef = useRef(true);

    const fetchUpdates = useCallback(async () => {
        if (!enabled || !mountedRef.current) return;
        
        try {
            setIsPolling(true);
            setError(null);
            
            const params = new URLSearchParams();
            if (lastCheck) {
                params.append('last_check', lastCheck);
            }
            
            const response = await fetch(`/api/admin/submissions/updates?${params}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data: PollingResponse = await response.json();
            
            if (!mountedRef.current) return;
            
            // Update last check timestamp
            setLastCheck(data.timestamp);
            
            // Process new payment notifications
            if (data.recent_payments && data.recent_payments.length > 0) {
                const newPayments = data.recent_payments.filter(payment => {
                    return !notifications.find(n => n.id === payment.id);
                });
                
                if (newPayments.length > 0) {
                    setNotifications(prev => {
                        const updated = [...newPayments, ...prev].slice(0, 10); // Keep only latest 10
                        return updated;
                    });
                    
                    // Call callback if provided
                    if (onNewPayments) {
                        onNewPayments(newPayments);
                    }
                    
                    // Show browser notification if permission granted
                    if (Notification.permission === 'granted' && newPayments.length > 0) {
                        const payment = newPayments[0];
                        new Notification('Bukti Pembayaran Baru', {
                            body: `${payment.submission.user.name} - ${payment.submission.title}`,
                            icon: '/favicon.ico',
                            tag: `payment-${payment.id}`
                        });
                    }
                }
            }
            
        } catch (err) {
            console.error('Polling error:', err);
            if (mountedRef.current) {
                setError(err instanceof Error ? err.message : 'Unknown error occurred');
            }
        } finally {
            if (mountedRef.current) {
                setIsPolling(false);
            }
        }
    }, [enabled, lastCheck, notifications, onNewPayments]);

    // Start polling
    const startPolling = useCallback(() => {
        if (!enabled || intervalRef.current) return;
        
        // Initial fetch
        fetchUpdates();
        
        // Set up interval
        intervalRef.current = setInterval(fetchUpdates, interval);
    }, [enabled, fetchUpdates, interval]);

    // Stop polling
    const stopPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    // Manual refresh
    const refresh = useCallback(() => {
        fetchUpdates();
    }, [fetchUpdates]);

    // Dismiss notification
    const dismissNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // Clear all notifications
    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    // Request notification permission
    const requestNotificationPermission = useCallback(async () => {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return Notification.permission === 'granted';
    }, []);

    // Navigate to submission
    const viewSubmission = useCallback((submissionId: string) => {
        router.visit(route('admin.abstract-submissions.show', submissionId));
    }, []);

    // Setup and cleanup
    useEffect(() => {
        mountedRef.current = true;
        
        if (enabled) {
            startPolling();
        }
        
        return () => {
            mountedRef.current = false;
            stopPolling();
        };
    }, [enabled, startPolling, stopPolling]);

    // Handle visibility change (pause polling when tab is not visible)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopPolling();
            } else if (enabled) {
                startPolling();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [enabled, startPolling, stopPolling]);

    return {
        notifications,
        isPolling,
        error,
        refresh,
        dismissNotification,
        clearAllNotifications,
        requestNotificationPermission,
        viewSubmission,
        startPolling,
        stopPolling
    };
}