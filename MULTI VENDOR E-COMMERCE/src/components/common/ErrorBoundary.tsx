import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in MarketHub component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[#E2E8E6] p-8 text-center space-y-4 shadow-sm">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-[#DC2626]">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[#172121]">Something went wrong.</h2>
            <p className="text-xs text-[#647070] leading-relaxed">
              An unexpected interface error occurred. Please refresh the page or try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
