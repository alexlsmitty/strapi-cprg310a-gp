// ErrorBoundary Component to catch rendering errors in LoginSignup
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ padding: 2 }}>
          <Alert severity="error">
            Something went wrong: {this.state.error && this.state.error.toString()}
          </Alert>
        </Box>
      );
    }
    return this.props.children; 
  }
};

export default ErrorBoundary