'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { taskUpdated, taskAssigned, annotationCreated } from '@/store/tasksSlice';

const WS_URL = 'ws://localhost:4000/ws';
const RECONNECT_DELAY = 3000;

export function useWebSocket() {
  const dispatch = useAppDispatch();
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUnmountedRef = useRef<boolean>(false);

  useEffect(() => {
    isUnmountedRef.current = false;

    function connect() {
      // If we already have an active socket, close it first
      if (socketRef.current) {
        socketRef.current.close();
      }

      console.log(`[WebSocket] Connecting to ${WS_URL}...`);
      const socket = new WebSocket(WS_URL);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('[WebSocket] Connection established successfully.');
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const { kind, payload } = message;

          if (!kind || !payload) return;

          switch (kind) {
            case 'task.updated':
              dispatch(taskUpdated(payload));
              break;
            case 'task.assigned':
              dispatch(taskAssigned(payload));
              break;
            case 'annotation.created':
              dispatch(annotationCreated(payload));
              break;
            default:
              console.warn(`[WebSocket] Unknown message kind: ${kind}`);
          }
        } catch (err) {
          console.error('[WebSocket] Error parsing socket payload:', err);
        }
      };

      socket.onerror = (err) => {
        console.error('[WebSocket] Socket connection error:', err);
      };

      socket.onclose = (event) => {
        socketRef.current = null;
        if (!isUnmountedRef.current) {
          console.log(`[WebSocket] Connection closed (code: ${event.code}). Retrying in ${RECONNECT_DELAY}ms...`);
          reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_DELAY);
        }
      };
    }

    connect();

    return () => {
      isUnmountedRef.current = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
      console.log('[WebSocket] Connection closed on unmount.');
    };
  }, [dispatch]);
}
