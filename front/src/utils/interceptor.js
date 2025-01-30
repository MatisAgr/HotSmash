import axios from 'axios';
import Cookies from 'js-cookie';

const MyAxios = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
});

// Request interceptor
MyAxios.interceptors.request.use(
    (config) => {
      const token = Cookies.get('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token trouvé et ajouté à l\'en-tête Authorization:', token);
      } else {
        console.log('Aucun token trouvé dans les cookies.');
      }
      return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
MyAxios.interceptors.response.use(
    response => {
        // Faire quelque chose avec les données de réponse
        console.log('Réponse reçue:', response);
        return response;
    },
    error => {
        // Faire quelque chose avec l'erreur de réponse
        console.log('Erreur de réponse:', error);
        return Promise.reject(error);
    }
);

export default MyAxios;