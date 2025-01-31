import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineUsers } from '../redux/slices/onlineUsersSlice';

export default function useWebSocket() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket('ws://localhost:8080'); // Assurez-vous que c'est le bon port

    ws.onopen = () => {
      console.log('WebSocket connecté');
      ws.send(JSON.stringify({ type: 'authenticate', token }));
      console.log('Message d\'authentification envoyé:', { type: 'authenticate', token });
    };

    ws.onmessage = (event) => {
      console.log('Message reçu du serveur:', event.data);
      const data = JSON.parse(event.data);
      if (data.type === 'onlineUsers') {
        dispatch(setOnlineUsers(data.users));
      } else if (data.type === 'error') {
        console.error('WebSocket error:', data.message);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket fermé');
    };

    return () => {
      ws.close();
    };
  }, [dispatch, token]);
}