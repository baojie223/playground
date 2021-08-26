import React from "react";

export default class ErrorBoundary extends React.Component<{}, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: any) {
    return {
      hasError: true,
      name: "shit",
    };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>{this.state.name}</h1>;
    }
    return this.props.children;
  }
}
