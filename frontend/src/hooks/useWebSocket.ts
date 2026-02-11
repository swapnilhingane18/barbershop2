/**
 * WebSocket Hook
 * Manages WebSocket connection using STOMP over SockJS
 */

import { useEffect, useRef, useState } from 'react';
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
    const isConnectingRef = useRef(false);
    const urlRef = useRef(url);
    const topicRef = useRef(topic);
    const onMessageRef = useRef(onMessage);
    const maxRetriesRef = useRef(maxRetries);
    const enabledRef = useRef(enabled);

    // Update refs when props change
    urlRef.current = url;
    topicRef.current = topic;
    onMessageRef.current = onMessage;
    maxRetriesRef.current = maxRetries;
    enabledRef.current = enabled;

    useEffect(() => {
        if (!enabledRef.current || isConnectingRef.current) {
            return;
        }

        isConnectingRef.current = true;

        const connect = () => {
            if (clientRef.current?.connected) {
                return;
            }

            try {
                const client = new Client({
                    webSocketFactory: () => new SockJS(urlRef.current) as any,
                    reconnectDelay: 0,
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

                        if (client && client.connected) {
                            subscriptionRef.current = client.subscribe(topicRef.current, (message) => {
                                try {
                                    const data = JSON.parse(message.body);
                                    onMessageRef.current(data);
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
        };

        const handleReconnect = () => {
            setRetryCount((prev) => {
                const newCount = prev + 1;

                if (newCount > maxRetriesRef.current) {
                    console.error('[WebSocket] Max retries reached, giving up');
                    setStatus('failed');
                    return prev;
                }

                setStatus('reconnecting');

                const delay = Math.min(1000 * Math.pow(2, prev), 16000);
                console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${newCount}/${maxRetriesRef.current})`);

                retryTimeoutRef.current = setTimeout(() => {
                    connect();
                }, delay);

                return newCount;
            });
        };

        connect();

        return () => {
            isConnectingRef.current = false;

            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
                retryTimeoutRef.current = null;
            }

            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }

            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }

            setStatus('disconnected');
        };
    }, []);

    const disconnect = () => {
        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }

        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
        }

        if (clientRef.current) {
            clientRef.current.deactivate();
            clientRef.current = null;
        }

        setStatus('disconnected');
    };

    return {
        status,
        retryCount,
        disconnect,
    };
};
