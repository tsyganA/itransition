import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Обновляет состояние для перехвата ошибки
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Вы можете логировать ошибку в системе логирования
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Показывает пользовательский UI в случае ошибки
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
