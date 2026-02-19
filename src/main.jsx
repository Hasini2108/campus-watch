import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ComplaintProvider>
                    <ScrollToTop />
                    <App />
                </ComplaintProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);

