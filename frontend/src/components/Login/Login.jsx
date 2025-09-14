import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

import logo from "../../assets/Bit-logo.png";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();

  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (loginError) setLoginError("");
  };

  // Helper to safely parse JSON
  const parseJSONSafe = async (response) => {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch (err) {
      return {};
    }
  };

  // Normal login with robust handling
  const handleSignIn = async () => {
    setLoginError("");
    if (!formData.email || !formData.password) {
      setLoginError("Please enter both email and password");
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
        credentials:"include"
      });

      const data = await parseJSONSafe(resp);

      if (resp.status == 200) {
        navigate("/dashboard");
        console.log('hi')
      } else {
        setLoginError(data.message || "Login failed");
      }
    } catch (error) {
      setLoginError(error.message || "An unexpected error occurred");
    }
    setLoading(false);
  };

  return (
    <div>
      <Card className="container">
        <img className="image" src={logo} alt="BIT Logo" />
        <h1 className="wel">WELCOME BACK!</h1>

        {loginError && (
          <Alert severity="error" sx={{ width: "22vw", margin: "10px auto" }}>
            {loginError}
          </Alert>
        )}

        <Box component="form" sx={{ "& > :not(style)": { m: 1, width: "22vw" } }}>
          <TextField
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
        </Box>

        <Box component="form" sx={{ "& > :not(style)": { m: 1, width: "22vw" } }}>
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
            disabled={loading || !formData.email || !formData.password}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            Sign in
          </Button>
        </Stack>

        <Divider sx={{ my: 2, fontSize: "14px", color: "#888" }} />

        <h4 className="last">Sign in with your BIT account</h4>
      </Card>
    </div>
  );
};

export default Login;
