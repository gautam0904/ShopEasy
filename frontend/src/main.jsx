import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux';
import { store } from './app/store.js';
import {ToastContainer} from 'react-toastify';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
    <App />
    <ToastContainer/>
    </Provider>
)
