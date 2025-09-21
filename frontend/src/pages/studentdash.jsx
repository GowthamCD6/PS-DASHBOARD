import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
  Alert
} from "@mui/material";
import { Person, School, EmojiEvents, TrendingUp } from "@mui/icons-material";
import axios from "axios";

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        // Mock data for now - replace with actual API call
        const mockData = {
          name: "John Doe",
          regNo: "REG2024001",
          year: "III",
          department: "Computer Science",
          totalLevels: 45,
          completedLevels: 32,
          cumulativeRewards: 850,
          currentSemRewards: 120,
          skills: [
            { name: "React", level: 8, progress: 80 },
            { name: "Node.js", level: 6, progress: 60 },
            { name: "Python", level: 7, progress: 70 },
            { name: "Database", level: 5, progress: 50 }
          ],
          recentActivities: [
            { date: "2024-01-15", activity: "Completed React Level 8", points: 25 },
            { date: "2024-01-12", activity: "Started Node.js Level 7", points: 0 },
            { date: "2024-01-10", activity: "Completed Python Level 7", points: 30 }
          ]
        };
        
        setStudentData(mockData);
      } catch (err) {
        setError("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Loading...</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const completionPercentage = studentData ? 
    Math.round((studentData.completedLevels / studentData.totalLevels) * 100) : 0;

  return (
    <Box sx={{ 
      p: 3, 
      backgroundColor: "#f5f5f5", 
      minHeight: "100vh",
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          color: "#1976d2", 
          mb: 1 
        }}>
          Student Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {studentData?.name}!
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: "100%",
            background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            color: "white"
          }}>
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                mx: "auto", 
                mb: 2,
                backgroundColor: "rgba(255,255,255,0.2)"
              }}>
                <Person sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {studentData?.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                {studentData?.regNo}
              </Typography>
              <Chip 
                label={`${studentData?.year} Year - ${studentData?.department}`}
                sx={{ 
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 500
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Overview */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Learning Progress Overview
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <School color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#1976d2" }}>
                      {studentData?.totalLevels}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Levels
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#2e7d32" }}>
                      {studentData?.completedLevels}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <EmojiEvents color="warning" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#f57c00" }}>
                      {studentData?.cumulativeRewards}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Points
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: "50%", 
                      backgroundColor: "#9c27b0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 8px",
                      color: "white",
                      fontSize: "18px",
                      fontWeight: "bold"
                    }}>
                      {completionPercentage}%
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#9c27b0" }}>
                      {studentData?.currentSemRewards}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current Sem
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Progress Bar */}
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Overall Progress
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {completionPercentage}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={completionPercentage}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: "#e0e0e0"
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Skills Progress */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Skills Progress
              </Typography>
              
              {studentData?.skills?.map((skill, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {skill.name}
                    </Typography>
                    <Typography variant="body2">
                      Level {skill.level}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={skill.progress}
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: "#f0f0f0"
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Recent Activities
              </Typography>
              
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Activity</TableCell>
                      <TableCell align="right">Points</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentData?.recentActivities?.map((activity, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(activity.date).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {activity.activity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={activity.points ? `+${activity.points}` : "0"}
                            size="small"
                            color={activity.points > 0 ? "success" : "default"}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Quick Actions
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ py: 2, textTransform: "none" }}
                  >
                    View All Courses
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ py: 2, textTransform: "none" }}
                  >
                    My Achievements
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ py: 2, textTransform: "none" }}
                  >
                    Schedule Practice
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ py: 2, textTransform: "none" }}
                  >
                    Contact Mentor
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;