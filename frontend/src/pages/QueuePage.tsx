/**
 * Queue Page
 * Customer queue management - join, view, and leave queue
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomer, useBarber } from '../context';
import { joinQueue, getQueue, getPosition, cancelSlot } from '../services';
import { useApi, useWebSocket } from '../hooks';
import { Layout, Card, Button, LoadingSpinner, Badge, toast } from '../components';
import { formatWaitTime, getRelativeTime } from '../utils/formatting';
import type { QueueEntry, PositionResponse } from '../types';

export const QueuePage = () => {
    const navigate = useNavigate();
    const { customer } = useCustomer();
    const { barberId } = useBarber();

    const [queue, setQueue] = useState<QueueEntry[]>([]);
    const [position, setPosition] = useState<PositionResponse | null>(null);
    const [inQueue, setInQueue] = useState(false);

    const queueApi = useApi<QueueEntry[]>();
    const positionApi = useApi<PositionResponse>();
    const joinApi = useApi<QueueEntry>();
    const leaveApi = useApi<string>();

    // Redirect if no customer
    useEffect(() => {
        if (!customer) {
            navigate('/');
        }
    }, [customer, navigate]);

    // Fetch queue data
    const fetchQueue = useCallback(async () => {
        const result = await queueApi.execute(() => getQueue(barberId));
        if (result) {
            setQueue(result);
        }
    }, [barberId]);

    const checkPosition = useCallback(async () => {
        if (!customer) return;

        const result = await positionApi.execute(() => getPosition(barberId, customer.id));
        if (result) {
            setPosition(result);
            setInQueue(true);
        } else {
            setPosition(null);
            setInQueue(false);
        }
    }, [customer, barberId]);

    // WebSocket integration
    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';
    const { status: wsStatus } = useWebSocket({
        url: wsUrl,
        topic: `/topic/barber/${barberId}`,
        onMessage: (message) => {
            console.log('[Queue Page] WebSocket message received:', message);
            // Refresh queue and position when update received
            fetchQueue();
            if (inQueue) {
                checkPosition();
            }
        },
        enabled: !!customer,
    });

    // Fallback polling when WebSocket fails
    useEffect(() => {
        if (!customer) return;

        // Initial fetch
        fetchQueue();
        checkPosition();

        // Only use polling if WebSocket failed
        if (wsStatus === 'failed') {
            console.log('[Queue Page] WebSocket failed, using fallback polling');
            const interval = setInterval(() => {
                fetchQueue();
                if (inQueue) {
                    checkPosition();
                }
            }, 10000); // Poll every 10 seconds

            return () => clearInterval(interval);
        }
    }, [customer, barberId, inQueue, wsStatus, fetchQueue, checkPosition]);

    const handleJoinQueue = async () => {
        if (!customer) return;

        const result = await joinApi.execute(() => joinQueue(barberId, customer.id));
        if (result) {
            toast.success('Successfully joined the queue!');
            setInQueue(true);
            fetchQueue();
            checkPosition();
        } else {
            toast.error('Failed to join queue. Please try again.');
        }
    };

    const handleLeaveQueue = async () => {
        if (!customer) return;

        const result = await leaveApi.execute(() => cancelSlot(barberId, customer.id));
        if (result) {
            toast.success('You have left the queue');
            setInQueue(false);
            setPosition(null);
            fetchQueue();
        } else {
            toast.error('Failed to leave queue. Please try again.');
        }
    };

    if (!customer) {
        return null;
    }

    return (
        <Layout title="Queue Status">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Customer Status Card */}
                <Card>
                    <h2 className="text-xl font-bold mb-4">Welcome, {customer.name}!</h2>

                    {!inQueue ? (
                        <div className="space-y-4">
                            <p className="text-gray-600">You are not in the queue yet.</p>
                            <Button
                                onClick={handleJoinQueue}
                                disabled={joinApi.loading}
                                className="w-full sm:w-auto"
                            >
                                {joinApi.loading ? 'Joining...' : 'Join Queue'}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {positionApi.loading ? (
                                <LoadingSpinner />
                            ) : position ? (
                                <div className="bg-blue-50 p-4 rounded">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-lg font-semibold">Your Position:</span>
                                        <span className="text-3xl font-bold text-blue-600">#{position.position}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Estimated Wait:</span>
                                        <span className="text-lg font-medium">{formatWaitTime(position.estimatedWaitTime)}</span>
                                    </div>
                                    <div className="mt-2">
                                        <Badge status={position.status} />
                                    </div>
                                </div>
                            ) : null}

                            <Button
                                onClick={handleLeaveQueue}
                                variant="danger"
                                disabled={leaveApi.loading}
                                className="w-full sm:w-auto"
                            >
                                {leaveApi.loading ? 'Leaving...' : 'Leave Queue'}
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Queue List Card */}
                <Card>
                    <h3 className="text-lg font-bold mb-4">Current Queue</h3>

                    {queueApi.loading ? (
                        <LoadingSpinner />
                    ) : queue.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No one in queue</p>
                    ) : (
                        <div className="space-y-3">
                            {queue.map((entry, index) => (
                                <div
                                    key={entry.id}
                                    className={`p-4 rounded border ${entry.customerId === customer.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                                            <div>
                                                <p className="font-medium">
                                                    Customer #{entry.customerId}
                                                    {entry.customerId === customer.id && (
                                                        <span className="ml-2 text-blue-600">(You)</span>
                                                    )}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Joined {getRelativeTime(entry.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge status={entry.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </Layout>
    );
};
