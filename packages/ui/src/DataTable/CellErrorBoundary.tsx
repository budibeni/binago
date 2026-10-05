import React from 'react';
import { AlertCircle } from 'lucide-react';

export class CellErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center gap-1.5 text-danger/80" title="Error rendering cell">
          <AlertCircle className="w-3.5 h-3.5" />
          <span className="italic text-[11px]">Error</span>
        </div>
      );
    }
    return this.props.children;
  }
}
