
import React, { useState } from "react";

//for navigation
import { useNavigate } from "react-router-dom";

//mui components
import {
  Button,
  Divider,
  Box,
  TextField,
  Stack,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Card,
  Alert,
  CircularProgress,
} from "@mui/material";

//components for firebase auth
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";

//assets
import logo from "../../assets/Bit-logo.png";
import goo from "../../assets/googleLogo.png";

//styles
import "./login.css";

//auth logic
import useStore from "../../store/store";

// Import API services
import { authService } from "../../services";
import { useApiCall } from "../../hooks/useApiCall";

const Login = () => {
  const navigate = useNavigate();

  // API hook for loading states
  const { loading, error, executeApiCall } = useApiCall();
  const [loginError, setLoginError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  //global state management variables
  const {
    isAuthenticated,
    setIsAuthenticated,
    setRollNumber,
    Attendance,
    setAttendance,
  } = useStore();
  const { setRole } = useStore();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (loginError) setLoginError("");
  };

  const handleSignIn = async () => {
    // Clear previous errors
    setLoginError("");

    // Validate inputs
    if (!formData.username || !formData.password) {
      setLoginError("Please enter both username and password");
      return;
    }

    try {
      const result = await executeApiCall(authService.login, {
        username: formData.username,
        password: formData.password,
      });

      if (result.success) {
        console.log("Login success:", result.data);
        
        // Update global state
        setIsAuthenticated(true);
        setRole(result.data.user?.role || 'student');
        setAttendance(result.data.user?.attendance || []);
        setRollNumber(result.data.user?.roll_number || formData.username);
        
        console.log("Authentication state updated");
        navigate("/dashboard");
        
        // Optional: Don't reload the page as state management should handle updates
        // window.location.reload();
      } else {
        setLoginError(result.message || "Login failed");
      }
    } catch (error) {
      console.error("❌ Error during login:", error);
      setLoginError(error.message || "An unexpected error occurred");
    }
  };

  const handleGoogleLogin = async () => {
    setLoginError("");
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        throw new Error("Email is missing from Firebase login response");
      }

      // Note: You might need to add a Google login endpoint to your backend
      // For now, using the regular login with email as username
      const loginResult = await executeApiCall(authService.login, {
        email: user.email,
        googleAuth: true,
      });

      if (loginResult.success) {
        console.log("Google Login success:", loginResult.data);
        
        // Update global state
        setIsAuthenticated(true);
        setRole(loginResult.data.user?.role || 'student');
        setAttendance(loginResult.data.user?.attendance || []);
        setRollNumber(loginResult.data.user?.roll_number || user.email);
        
        console.log("Authentication state updated");
        navigate("/dashboard");
      } else {
        setLoginError(loginResult.message || "Google login failed");
      }
    } catch (error) {
      console.error("❌ Error during Google login:", error);
      setLoginError(error.message || "Google login failed");
    }
  };

  return (
    <div>
      <Card className="container">
        <img className="image" src={logo} alt="BIT Logo" />
        <h1 className="wel">WELCOME BACK!</h1>

        {/* Error Display */}
        {loginError && (
          <Alert severity="error" sx={{ width: "22vw", margin: "10px auto" }}>
            {loginError}
          </Alert>
        )}

        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1, width: "22vw" } }}
        >
          <TextField 
            name="username"
            label="Username" 
            value={formData.username}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
        </Box>

        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1, width: "22vw" } }}
        >
          <TextField 
            name="password"
            label="Password" 
            type="password" 
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
          <Stack justifyContent="flex-start" width="45vw" mb="7px">
            <FormGroup>
              <FormControlLabel control={<Checkbox />} label="Remember me" />
            </FormGroup>
          </Stack>
        </Box>

        <Stack spacing={2} direction="row">
          <Button
            variant="contained"
            sx={{
              fontSize: "15px",
              borderRadius: "8px",
              width: "22vw",
              textTransform: "none",
              "&:hover": { backgroundColor: "#115293" },
            }}
            onClick={handleSignIn}
            disabled={loading || !formData.username || !formData.password}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Sign in
          </Button>
        </Stack>

        <Divider sx={{ my: 2, fontSize: "14px", color: "#888" }}>OR</Divider>

        <Button
          onClick={handleGoogleLogin}
          variant="outlined"
          disabled={loading}
          sx={{
            border: "1px solid #dadce0",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 500,
            padding: "8px 20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "22vw",
            height: "6vh",
            borderRadius: "8px",
            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "#f7f7f7",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <img
              src={goo}
              alt="google"
              style={{ width: "40px", height: "40px" }}
            />
          )}
          Sign in with Google
        </Button>

        <h4 className="last">Sign in with your BIT account</h4>
      </Card>
    </div>
  );
};

export default Login;

// Temporary placeholder component - returns a simple div

