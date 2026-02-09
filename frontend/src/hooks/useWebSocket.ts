/**
 * WebSocket Hook
 * Manages WebSocket connection using STOMP over SockJS
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import type { StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected' | 'failed';

interface UseWebSocketOptions {
    url: string;
    topic: string;
    onMessage: (message: any) => void;
    maxRetries?: number;
    enabled?: boolean;
}

interface UseWebSocketReturn {
    status: ConnectionStatus;
    retryCount: number;
    disconnect: () => void;
}

export const useWebSocket = ({
    url,
    topic,
    onMessage,
    maxRetries = 5,
    enabled = true,
}: UseWebSocketOptions): UseWebSocketReturn => {
    const [status, setStatus] = useState<ConnectionStatus>('disconnected');
    const [retryCount, setRetryCount] = useState(0);

    const clientRef = useRef<Client | null>(null);
    const subscriptionRef = useRef<StompSubscription | null>(null);
    const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const disconnect = useCallback(() => {
        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
        }

        if (clientRef.current) {
            clientRef.current.deactivate();
            clientRef.current = null;
        }

        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }

        setStatus('disconnected');
    }, []);

    const connect = useCallback(() => {
        if (!enabled) {
            return;
        }

        // Clean up existing connection
        disconnect();

        try {
            // Create STOMP client with SockJS
            const client = new Client({
                webSocketFactory: () => new SockJS(url) as any,
                reconnectDelay: 0, // We handle reconnection manually
                heartbeatIncoming: 10000,
                heartbeatOutgoing: 10000,
                debug: (str) => {
                    if (import.meta.env.DEV) {
                        console.log('[WebSocket Debug]', str);
                    }
                },
                onConnect: () => {
                    console.log('[WebSocket] Connected');
                    setStatus('connected');
                    setRetryCount(0);

                    // Subscribe to topic
                    if (client && client.connected) {
                        subscriptionRef.current = client.subscribe(topic, (message) => {
                            try {
                                const data = JSON.parse(message.body);
                                onMessage(data);
                            } catch (error) {
                                console.error('[WebSocket] Failed to parse message:', error);
                            }
                        });
                    }
                },
                onDisconnect: () => {
                    console.log('[WebSocket] Disconnected');
                    setStatus('disconnected');
                },
                onStompError: (frame) => {
                    console.error('[WebSocket] STOMP error:', frame);
                    handleReconnect();
                },
                onWebSocketError: (event) => {
                    console.error('[WebSocket] WebSocket error:', event);
                    handleReconnect();
                },
            });

            clientRef.current = client;
            client.activate();
        } catch (error) {
            console.error('[WebSocket] Connection error:', error);
            handleReconnect();
        }
    }, [url, topic, onMessage, enabled, disconnect]);

    const handleReconnect = useCallback(() => {
        if (retryCount >= maxRetries) {
            console.error('[WebSocket] Max retries reached, giving up');
            setStatus('failed');
            return;
        }

        setStatus('reconnecting');

        // Exponential backoff: 1s, 2s, 4s, 8s, 16s
        const delay = Math.min(1000 * Math.pow(2, retryCount), 16000);
        console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);

        retryTimeoutRef.current = setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            connect();
        }, delay);
    }, [retryCount, maxRetries, connect]);

    // Initial connection
    useEffect(() => {
        if (enabled) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [enabled, connect, disconnect]);

    return {
        status,
        retryCount,
        disconnect,
    };
};
