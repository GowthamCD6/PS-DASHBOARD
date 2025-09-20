/**
 * Error Logging Service
 * Handles error reporting, logging, and analytics for the PS Dashboard application
 */

class ErrorReportingService {
  constructor() {
    this.apiEndpoint = import.meta.env.VITE_ERROR_REPORTING_ENDPOINT || '/api/errors';
    this.maxRetries = 3;
    this.retryDelay = 1000;
    this.errorQueue = [];
    this.isOnline = navigator.onLine;

    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    // Process any queued errors on startup
    this.processErrorQueue();
  }

  /**
   * Main method to report errors
   * @param {Object} errorData - Error information
   */
  async report(errorData) {
    const enrichedError = this.enrichErrorData(errorData);
    
    try {
      // Log to console in development
      if (import.meta.env.DEV) {
        console.group(`🐛 Error Report: ${enrichedError.id}`);
        console.error('Error:', enrichedError.error);
        console.log('Context:', enrichedError.context);
        console.log('User Info:', enrichedError.user);
        console.groupEnd();
      }

      // Store locally first
      this.storeErrorLocally(enrichedError);

      // Send to server if online
      if (this.isOnline) {
        await this.sendToServer(enrichedError);
      } else {
        this.queueError(enrichedError);
      }

      return enrichedError.id;
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
      this.queueError(enrichedError);
      return null;
    }
  }

  /**
   * Report JavaScript errors
   */
  reportJSError(error, errorInfo = {}) {
    return this.report({
      type: 'javascript',
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      severity: 'high'
    });
  }

  /**
   * Report network errors
   */
  reportNetworkError(error, requestInfo = {}) {
    return this.report({
      type: 'network',
      error: error.message || error.toString(),
      url: requestInfo.url,
      method: requestInfo.method,
      status: requestInfo.status,
      severity: 'medium'
    });
  }

  /**
   * Report user action errors
   */
  reportUserActionError(action, error, context = {}) {
    return this.report({
      type: 'user_action',
      action,
      error: error.toString(),
      context,
      severity: 'low'
    });
  }

  /**
   * Report performance issues
   */
  reportPerformanceIssue(metric, value, threshold) {
    return this.report({
      type: 'performance',
      metric,
      value,
      threshold,
      severity: 'medium',
      error: `Performance issue: ${metric} (${value}) exceeded threshold (${threshold})`
    });
  }

  /**
   * Enrich error data with additional context
   */
  enrichErrorData(errorData) {
    const timestamp = new Date().toISOString();
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      ...errorData,
      id: errorId,
      timestamp,
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      user: this.getCurrentUser(),
      context: {
        ...errorData.context,
        sessionId: this.getSessionId(),
        userId: this.getUserId(),
        buildVersion: import.meta.env.VITE_APP_VERSION || 'unknown'
      },
      environment: import.meta.env.MODE || 'development'
    };
  }

  /**
   * Store error locally for offline support
   */
  storeErrorLocally(errorData) {
    try {
      const errors = this.getStoredErrors();
      errors.push(errorData);
      
      // Keep only last 50 errors to prevent storage overflow
      const recentErrors = errors.slice(-50);
      localStorage.setItem('ps_dashboard_errors', JSON.stringify(recentErrors));
    } catch (storageError) {
      console.warn('Failed to store error locally:', storageError);
    }
  }

  /**
   * Get stored errors from localStorage
   */
  getStoredErrors() {
    try {
      const stored = localStorage.getItem('ps_dashboard_errors');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to retrieve stored errors:', error);
      return [];
    }
  }

  /**
   * Send error to server
   */
  async sendToServer(errorData, retryCount = 0) {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthToken()
        },
        body: JSON.stringify(errorData)
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (retryCount < this.maxRetries) {
        console.log(`Retrying error report (${retryCount + 1}/${this.maxRetries})`);
        await this.delay(this.retryDelay * Math.pow(2, retryCount));
        return this.sendToServer(errorData, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * Queue error for later sending
   */
  queueError(errorData) {
    this.errorQueue.push(errorData);
    console.log(`Error queued for later sending: ${errorData.id}`);
  }

  /**
   * Process queued errors when online
   */
  async processErrorQueue() {
    if (!this.isOnline || this.errorQueue.length === 0) {
      return;
    }

    console.log(`Processing ${this.errorQueue.length} queued errors`);

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    for (const error of errors) {
      try {
        await this.sendToServer(error);
        console.log(`Sent queued error: ${error.id}`);
      } catch (sendError) {
        console.error(`Failed to send queued error: ${error.id}`, sendError);
        this.queueError(error); // Re-queue if failed
      }
    }
  }

  /**
   * Handle online event
   */
  handleOnline() {
    this.isOnline = true;
    console.log('Connection restored - processing queued errors');
    this.processErrorQueue();
  }

  /**
   * Handle offline event
   */
  handleOffline() {
    this.isOnline = false;
    console.log('Connection lost - errors will be queued');
  }

  /**
   * Get current user info (placeholder - implement based on your auth system)
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get user ID
   */
  getUserId() {
    const user = this.getCurrentUser();
    return user?.id || 'anonymous';
  }

  /**
   * Get session ID
   */
  getSessionId() {
    let sessionId = localStorage.getItem('ps_dashboard_session_id');
    if (!sessionId) {
      sessionId = `sess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('ps_dashboard_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Get auth token (implement based on your auth system)
   */
  getAuthToken() {
    return localStorage.getItem('auth_token') || '';
  }

  /**
   * Utility method for delays
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const errors = this.getStoredErrors();
    const last24Hours = errors.filter(error => 
      new Date(error.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    return {
      total: errors.length,
      last24Hours: last24Hours.length,
      byType: this.groupBy(errors, 'type'),
      bySeverity: this.groupBy(errors, 'severity'),
      queued: this.errorQueue.length
    };
  }

  /**
   * Utility method to group array by property
   */
  groupBy(array, property) {
    return array.reduce((groups, item) => {
      const key = item[property] || 'unknown';
      groups[key] = (groups[key] || 0) + 1;
      return groups;
    }, {});
  }

  /**
   * Clear stored errors (for testing/cleanup)
   */
  clearStoredErrors() {
    localStorage.removeItem('ps_dashboard_errors');
    this.errorQueue = [];
  }
}

// Create singleton instance
const errorReportingService = new ErrorReportingService();

// Set up global error handlers
window.addEventListener('error', (event) => {
  errorReportingService.reportJSError(event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  errorReportingService.reportJSError(event.reason, {
    type: 'unhandled_promise_rejection'
  });
});

export default errorReportingService;