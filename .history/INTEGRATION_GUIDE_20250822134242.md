# Frontend-Backend Integration Guide

## 🚀 Overview

This project now has a complete integration between the React frontend and Node.js backend using a modern, scalable architecture.

## 📁 API Architecture

### Service Layer (`src/services/`)

1. **`apiConfig.js`** - Central API configuration
   - Axios instance with base URL
   - Request/response interceptors
   - Error handling
   - Authentication token management

2. **`authService.js`** - Authentication management
   - Login/logout functionality
   - Token storage
   - User session management

3. **`studentService.js`** - Student data operations
   - Get all students
   - Get user by ID
   - Filter operations
   - CRUD operations for skills

4. **`index.js`** - Central exports

### Custom Hooks (`src/hooks/`)

1. **`useApiCall.js`** - API state management
   - Loading states
   - Error handling
   - Data management

## 🔧 Configuration

### Environment Variables

**Frontend (`.env`):**
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=PS Dashboard
```

**Backend (`.env`):**
```env
PORT=3000
DB_NAME=ps_dashboard
DB_USER=root
DB_PASSWORD=GCN@6677
DB_HOST=localhost
JWT_SECRET=jwt_secret_key
```

## 🛠 Usage Examples

### 1. Using Authentication Service

```jsx
import { authService } from '../services';
import { useApiCall } from '../hooks/useApiCall';

const LoginComponent = () => {
  const { loading, executeApiCall } = useApiCall();

  const handleLogin = async (credentials) => {
    const result = await executeApiCall(authService.login, credentials);
    if (result.success) {
      // Handle success
      navigate('/dashboard');
    }
  };
};
```

### 2. Fetching Student Data

```jsx
import { studentService } from '../services';
import { useApiCall } from '../hooks/useApiCall';

const Dashboard = () => {
  const { loading, data, executeApiCall } = useApiCall();

  useEffect(() => {
    const fetchStudents = async () => {
      const result = await executeApiCall(studentService.getAllUsers);
      if (result.success) {
        setStudents(result.data);
      }
    };
    fetchStudents();
  }, []);
};
```

### 3. Protected Routes

```jsx
import ProtectedRoute from '../components/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## 🔐 Authentication Flow

1. **Login Process:**
   - User submits credentials
   - Frontend calls `authService.login()`
   - Backend validates and returns JWT token
   - Token stored in localStorage
   - User redirected to dashboard

2. **Protected Requests:**
   - API interceptor automatically adds token to headers
   - Backend validates token on protected routes
   - Auto-logout on token expiry

3. **Logout Process:**
   - Call `authService.logout()`
   - Clear localStorage
   - Redirect to login page

## 🔄 Error Handling

### Centralized Error Management

- **Network Errors:** Handled by axios interceptors
- **401 Unauthorized:** Auto-logout and redirect
- **API Errors:** Consistent error format across app
- **Loading States:** Built into useApiCall hook

### Error Display

```jsx
// Automatic error handling with useApiCall
const { loading, error, executeApiCall } = useApiCall();

// Manual error handling
try {
  const result = await executeApiCall(apiFunction);
  if (!result.success) {
    setError(result.message);
  }
} catch (error) {
  setError(error.message);
}
```

## 📡 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Students
- `GET /student/get_all_users` - Get all students
- `GET /student/user_data/:id` - Get student by ID

## 🚀 Getting Started

### 1. Start Backend Server
```bash
cd backend
npm start
```

### 2. Start Frontend Development Server
```bash
cd frontend
npm run dev
```

### 3. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 📝 Best Practices

1. **Always use the service layer** - Don't make direct axios calls
2. **Use useApiCall hook** - For consistent loading/error states
3. **Handle errors gracefully** - Show user-friendly messages
4. **Protect sensitive routes** - Use ProtectedRoute component
5. **Validate data** - Both frontend and backend validation

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors:** Backend already configured for frontend origin
2. **Database Connection:** Check MySQL service and credentials
3. **Token Issues:** Clear localStorage and re-login
4. **Port Conflicts:** Ensure backend (3000) and frontend (5173) ports are available

### Debug Tips

1. Check browser network tab for API calls
2. Verify environment variables are loaded
3. Check backend console for errors
4. Use React DevTools for state inspection

## 🎯 Next Steps

1. **Add more API endpoints** as needed
2. **Implement caching** for better performance
3. **Add offline support** with service workers
4. **Enhance error boundaries** for better UX
5. **Add API documentation** with Swagger

## 🤝 Contributing

When adding new API functionality:

1. Create service methods in appropriate service files
2. Use the useApiCall hook for state management
3. Follow the established error handling patterns
4. Update this documentation

---

**Happy Coding! 🚀**
