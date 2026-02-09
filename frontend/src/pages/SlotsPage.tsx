/**
 * Slots View Page
 * Display available appointment slots (view-only for MVP)
 */

import { useState, useEffect } from 'react';
import { useBarber } from '../context';
import { getSlots } from '../services';
import { useApi } from '../hooks/useApi';
import { Layout, Card, LoadingSpinner, Button } from '../components';
import { formatTime, formatDate } from '../utils/formatting';
import type { Slot, SlotStatus } from '../types';

export const SlotsPage = () => {
    const { barberId } = useBarber();
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [slots, setSlots] = useState<Slot[]>([]);
    const slotsApi = useApi<Slot[]>();

    useEffect(() => {
        fetchSlots();
    }, [selectedDate, barberId]);

    const fetchSlots = async () => {
        // Convert date to ISO 8601 DateTime format
        const dateTime = new Date(selectedDate).toISOString();
        const result = await slotsApi.execute(() => getSlots(barberId, dateTime));
        if (result) {
            setSlots(result);
        }
    };

    const getSlotStatusBadge = (status: SlotStatus) => {
        const config = {
            AVAILABLE: { label: 'Available', classes: 'bg-green-100 text-green-800' },
            BOOKED: { label: 'Booked', classes: 'bg-red-100 text-red-800' },
            LOCKED: { label: 'Locked', classes: 'bg-yellow-100 text-yellow-800' },
        };

        const { label, classes } = config[status];
        return <span className={`px-3 py-1 rounded-full text-sm font-medium ${classes}`}>{label}</span>;
    };

    return (
        <Layout title="Available Slots">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Date Selector Card */}
                <Card>
                    <h2 className="text-xl font-bold mb-4">Select Date</h2>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                        Viewing slots for {formatDate(new Date(selectedDate).toISOString())}
                    </p>
                </Card>

                {/* Slots List Card */}
                <Card>
                    <h3 className="text-lg font-bold mb-4">Available Time Slots</h3>

                    {slotsApi.loading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : slotsApi.error ? (
                        <div className="text-center py-12 space-y-4">
                            <p className="text-red-600 font-medium">Failed to load slots</p>
                            <p className="text-gray-600 text-sm">{slotsApi.error}</p>
                            <Button onClick={fetchSlots} variant="secondary">
                                Try Again
                            </Button>
                        </div>
                    ) : slots.length === 0 ? (
                        <div className="text-center py-12 space-y-2">
                            <p className="text-gray-600 font-medium">No slots available for this date</p>
                            <p className="text-sm text-gray-500">
                                Try selecting a different date or check back later
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {slots.map((slot) => (
                                <div
                                    key={slot.id}
                                    className={`p-4 rounded border ${slot.status === 'AVAILABLE'
                                        ? 'border-green-300 bg-green-50'
                                        : 'border-gray-300 bg-gray-50'
                                        }`}
                                >
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-lg">
                                                {formatTime(slot.startTime)}
                                            </span>
                                            {getSlotStatusBadge(slot.status)}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Duration: {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                        </p>
                                        {slot.status === 'BOOKED' && slot.bookedByUserId && (
                                            <p className="text-xs text-gray-500">
                                                Booked by User #{slot.bookedByUserId}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                <Card className="bg-blue-50">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Slot booking is not available in this MVP version.
                        You can join the walk-in queue from the Queue page.
                    </p>
                </Card>
            </div>
        </Layout>
    );
};
