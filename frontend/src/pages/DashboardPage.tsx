/**
 * Dashboard Page (Barber View)
 * Queue management and slot generation for barbers
 */

import { useState, useEffect, useCallback } from 'react';
import { useBarber } from '../context';
import { getQueue, completeCustomer, markNoShow, generateSlots } from '../services';
import { useApi, useWebSocket } from '../hooks';
import { Layout, Card, Button, LoadingSpinner, Badge, Input, toast } from '../components';
import { formatDateTime, getRelativeTime } from '../utils/formatting';
import type { QueueEntry, Slot } from '../types';
import { QueueStatus } from '../types';

export const DashboardPage = () => {
    const { barberId } = useBarber();
    const [queue, setQueue] = useState<QueueEntry[]>([]);
    const [generatedSlots, setGeneratedSlots] = useState<Slot[]>([]);

    // Slot form state
    const [slotDate, setSlotDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState<string>('09:00');
    const [endTime, setEndTime] = useState<string>('17:00');
    const [duration, setDuration] = useState<string>('30');

    const queueApi = useApi<QueueEntry[]>();
    const completeApi = useApi<string>();
    const noShowApi = useApi<string>();
    const slotsApi = useApi<Slot[]>();

    // Fetch queue data
    const fetchQueue = useCallback(async () => {
        const result = await queueApi.execute(() => getQueue(barberId));
        if (result) {
            setQueue(result);
        }
    }, [barberId]);

    // WebSocket integration
    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';
    const { status: wsStatus } = useWebSocket({
        url: wsUrl,
        topic: `/topic/barber/${barberId}`,
        onMessage: (message) => {
            console.log('[Dashboard] WebSocket message received:', message);
            // Refresh queue when update received
            fetchQueue();
        },
    });

    // Fallback polling when WebSocket fails
    useEffect(() => {
        // Initial fetch
        fetchQueue();

        // Only use polling if WebSocket failed
        if (wsStatus === 'failed') {
            console.log('[Dashboard] WebSocket failed, using fallback polling');
            const interval = setInterval(fetchQueue, 10000); // Poll every 10 seconds
            return () => clearInterval(interval);
        }
    }, [barberId, wsStatus, fetchQueue]);

    const handleCompleteCustomer = async () => {
        const result = await completeApi.execute(() => completeCustomer(barberId));
        if (result) {
            toast.success(result);
            fetchQueue();
        } else {
            toast.error('Failed to complete customer');
        }
    };

    const handleMarkNoShow = async () => {
        const result = await noShowApi.execute(() => markNoShow(barberId));
        if (result) {
            toast.success(result);
            fetchQueue();
        } else {
            toast.error('Failed to mark no-show');
        }
    };

    const handleGenerateSlots = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate inputs
        if (!slotDate || !startTime || !endTime || !duration) {
            toast.error('Please fill in all fields');
            return;
        }

        const durationNum = parseInt(duration, 10);
        if (isNaN(durationNum) || durationNum < 1) {
            toast.error('Duration must be a positive number');
            return;
        }

        // Create ISO 8601 datetime strings
        const startDateTime = new Date(`${slotDate}T${startTime}:00`).toISOString();
        const endDateTime = new Date(`${slotDate}T${endTime}:00`).toISOString();

        const result = await slotsApi.execute(() =>
            generateSlots(barberId, startDateTime, endDateTime, durationNum)
        );

        if (result) {
            setGeneratedSlots(result);
            toast.success(`Generated ${result.length} slots`);
        } else {
            toast.error('Failed to generate slots');
        }
    };

    // Get current customer (IN_PROGRESS)
    const currentCustomer = queue.find((entry) => entry.status === QueueStatus.IN_PROGRESS);

    // Get waiting customers
    const waitingCustomers = queue.filter((entry) => entry.status === QueueStatus.WAITING);

    return (
        <Layout title="Barber Dashboard">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Current Customer Card */}
                <Card>
                    <h2 className="text-xl font-bold mb-4">Current Customer</h2>

                    {queueApi.loading ? (
                        <LoadingSpinner />
                    ) : currentCustomer ? (
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="text-lg font-semibold">Customer #{currentCustomer.customerId}</p>
                                        <p className="text-sm text-gray-600">
                                            Position: #{currentCustomer.position} | Joined {getRelativeTime(currentCustomer.createdAt)}
                                        </p>
                                    </div>
                                    <Badge status={currentCustomer.status} />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={handleCompleteCustomer}
                                    disabled={completeApi.loading}
                                    variant="primary"
                                >
                                    {completeApi.loading ? 'Processing...' : 'Call Next (Complete)'}
                                </Button>
                                <Button
                                    onClick={handleMarkNoShow}
                                    disabled={noShowApi.loading}
                                    variant="danger"
                                >
                                    {noShowApi.loading ? 'Processing...' : 'Mark No-Show'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">No customer currently being served</p>
                    )}
                </Card>

                {/* Waiting Queue Card */}
                <Card>
                    <h3 className="text-lg font-bold mb-4">Waiting Queue ({waitingCustomers.length})</h3>

                    {queueApi.loading ? (
                        <LoadingSpinner />
                    ) : waitingCustomers.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No customers waiting</p>
                    ) : (
                        <div className="space-y-3">
                            {waitingCustomers.map((entry, index) => (
                                <div key={entry.id} className="p-4 rounded border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                                            <div>
                                                <p className="font-medium">Customer #{entry.customerId}</p>
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

                {/* Slot Management Card */}
                <Card>
                    <h3 className="text-lg font-bold mb-4">Generate Appointment Slots</h3>

                    <form onSubmit={handleGenerateSlots} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Date"
                                type="date"
                                value={slotDate}
                                onChange={setSlotDate}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />

                            <Input
                                label="Duration (minutes)"
                                type="number"
                                value={duration}
                                onChange={setDuration}
                                placeholder="30"
                                required
                            />

                            <Input
                                label="Start Time"
                                type="time"
                                value={startTime}
                                onChange={setStartTime}
                                required
                            />

                            <Input
                                label="End Time"
                                type="time"
                                value={endTime}
                                onChange={setEndTime}
                                required
                            />
                        </div>

                        <Button type="submit" disabled={slotsApi.loading}>
                            {slotsApi.loading ? 'Generating...' : 'Generate Slots'}
                        </Button>
                    </form>

                    {/* Generated Slots Display */}
                    {generatedSlots.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-semibold mb-3">Generated Slots ({generatedSlots.length})</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {generatedSlots.map((slot) => (
                                    <div
                                        key={slot.id}
                                        className="p-3 bg-green-50 border border-green-300 rounded text-center"
                                    >
                                        <p className="text-sm font-medium">{formatDateTime(slot.startTime)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </Layout>
    );
};
