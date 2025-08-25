
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
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        throw new Error("Email is missing from Firebase login response");
      }

      const response = await axios.post(
        "http://localhost:7000/api/auth/google",
        {
          email: user.email,
        }
      );
      // console.log(response.data.user.role);

      console.log("Login success:", response.data);
      setIsAuthenticated(true);
      setRole(response.data.user.role);
      setAttendance(response.data.user.attendance);
      setRollNumber(response.data.user.roll_number);
      console.log(isAuthenticated);
      navigate("/dashboard");
      window.location.reload(); //this makes sure that the page is reloded after login because to make sure teh state is updated (used this method instead of using useEffect)
    } catch (error) {
      console.error("❌ Error during Firebase login:", error.message);
      alert("Login failed: " + (error.response?.data?.error || error.message)); //will be removed after testing and use MUI alert component instead
    }
  };

  return (
    <div>
      <Card className="container">
        <img className="image" src={logo} alt="BIT Logo" />
        <h1 className="wel">WELCOME BACK!</h1>

        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1, width: "22vw" } }}
        >
          <TextField id="username" label="Username" />
        </Box>

        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1, width: "22vw" } }}
        >
          <TextField id="password" label="Password" type="password" />
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
          >
            Sign in
          </Button>
        </Stack>

        <Divider sx={{ my: 2, fontSize: "14px", color: "#888" }}>OR</Divider>

        <Button
          onClick={handleGoogleLogin}
          variant="outlined"
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
          <img
            src={goo}
            alt="google"
            style={{ width: "40px", height: "40px" }}
          />
          Sign in with Google
        </Button>

        <h4 className="last">Sign in with your BIT account</h4>
      </Card>
    </div>
  );
};

export default Login;

// Temporary placeholder component - returns a simple div

