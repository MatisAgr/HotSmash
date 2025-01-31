import axios from 'axios';
import Cookies from 'js-cookie';

const MyAxios = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
});

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

MyAxios.interceptors.response.use(
    response => {
        console.log('Réponse reçue:', response);
        return response;
    },
    error => {
        console.log('Erreur de réponse:', error);
        return Promise.reject(error);
    }
);

export default MyAxios;