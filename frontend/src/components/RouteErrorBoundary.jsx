import { Component } from "react";

export default class RouteErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[Mson] Page render error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="container error-shell">
          <h1>Something went wrong on this page</h1>
          <p className="error-shell-detail">{String(this.state.error.message || this.state.error)}</p>
          <button type="button" className="btn btn-primary error-shell-retry" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
