
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const onlineUsersSlice = createSlice({
    name: 'onlineUsers',
    initialState: {
        users: []
    },
    reducers: {
        setOnlineUsers: (state, action) => {
            state.users = action.payload;
        }
    }
});

export const { setOnlineUsers } = onlineUsersSlice.actions;

export const initiateWebSocket = () => (dispatch) => {
    const token = Cookies.get('authToken');
    if (!token) {
        console.log('Pas de token d\'authentification trouvé.');
        return;
    }

    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
        console.log('Connexion WebSocket établie');
        socket.send(JSON.stringify({ type: 'authenticate', token }));
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'onlineUsers') {
            dispatch(setOnlineUsers(data.users));
        }
    };

    socket.onclose = () => {
        console.log('Connexion WebSocket fermée');
    };

    socket.onerror = (error) => {
        console.log('Erreur WebSocket:', error);
    };
};

export default onlineUsersSlice.reducer;