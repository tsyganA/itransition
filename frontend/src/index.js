import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import ErrorBoundary from './ErrorBoundary';

// Получаем root элемент
const rootElement = document.getElementById('root');

if (rootElement) {
    const root = createRoot(rootElement);

    root.render(
        <React.StrictMode>
            <ErrorBoundary>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ErrorBoundary>
        </React.StrictMode>
    );
} else {
    console.error('Root element not found');
}

// Дополнительно: можно обработать глобальные ошибки
window.onerror = function (message, source, lineno, colno, error) {
    console.error('Global error caught: ', { message, source, lineno, colno, error });
};

window.onunhandledrejection = function (event) {
    console.error('Unhandled promise rejection: ', event.reason);
};
