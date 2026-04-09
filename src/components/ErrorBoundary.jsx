import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console (in a real app, send to error reporting service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: 'var(--background)',
          color: 'var(--text-main)'
        }}>
          <div style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--text-light)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%'
          }}>
            <h2 style={{ color: 'var(--error)', marginBottom: '1rem' }}>
              ¡Ups! Algo salió mal
            </h2>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              Ha ocurrido un error inesperado. Por favor, recarga la página para continuar.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              Recargar página
            </button>

            {import.meta.env.MODE === 'development' && (
              <details style={{ marginTop: '2rem', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
                  Detalles técnicos (desarrollo)
                </summary>
                <pre style={{
                  background: 'var(--background)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  overflow: 'auto',
                  marginTop: '0.5rem',
                  color: 'var(--error)'
                }}>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;