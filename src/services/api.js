import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
        }
        return Promise.reject(error);
    }
);

export const get = (url, config = {}) =>
    api.get(url, config).then((res) => res.data);

export const post = (url, data, config = {}) =>
    api.post(url, data, config).then((res) => res.data);

export const put = (url, data, config = {}) =>
    api.put(url, data, config).then((res) => res.data);

export const patch = (url, data, config = {}) =>
    api.patch(url, data, config).then((res) => res.data);

export const del = (url, config = {}) =>
    api.delete(url, config).then((res) => res.data);

export const getImageUrl = (relativePath) =>
    `${API_BASE_URL.replace('/api', '')}/proxy-image?path=${encodeURIComponent(relativePath)}`;

export default {
    get,
    post,
    put,
    patch,
    delete: del,
    axios: api,
};
