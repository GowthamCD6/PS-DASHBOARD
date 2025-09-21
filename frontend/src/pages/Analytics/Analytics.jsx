import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

// DATA
const attendanceData = [
  { day: "Mon", Attendance: 92 },
  { day: "Tue", Attendance: 88 },
  { day: "Wed", Attendance: 90 },
  { day: "Thu", Attendance: 85 },
  { day: "Fri", Attendance: 95 },
  { day: "Sat", Attendance: 98 },
  { day: "Sun", Attendance: 91 },
];
const gradesData = [
  { subject: "Math", Grade: 92 },
  { subject: "Physics", Grade: 86 },
  { subject: "Chemistry", Grade: 81 },
  { subject: "English", Grade: 75 },
  { subject: "CS", Grade: 95 },
  { subject: "History", Grade: 70 },
];
const progressData = [
  { month: "Apr", Progress: 85 },
  { month: "May", Progress: 88 },
  { month: "Jun", Progress: 92 },
  { month: "Jul", Progress: 90 },
  { month: "Aug", Progress: 93 },
  { month: "Sep", Progress: 96 },
];
const pieData = [
  { name: "Assignments", value: 30 },
  { name: "Quizzes", value: 20 },
  { name: "Projects", value: 25 },
  { name: "Exams", value: 25 },
];
const COLORS = ["#4F46E5", "#7C3AED", "#06B6D4", "#10B981"];

function Analytics() {
  return (
    <div className="analytics-root">
      {/* HEADER */}
      <header className="analytics-header">
        <div>
          <h1>Student Analytics</h1>
          <span className="subtitle">Advanced insights at a glance</span>
        </div>
        <div className="profile">
          <div className="avatar">
            <span className="avatar-text">DA</span>
          </div>
          <div className="profile-info">
            <div className="profile-name">Deepak A.</div>
            <div className="profile-role">Computer Science Student</div>
          </div>
        </div>
      </header>
      
      {/* MAIN CONTENT */}
      <main className="analytics-main">
        <div className="analytics-grid">
          {/* Weekly Attendance */}
          <section className="analytics-card">
            <div className="card-header">
              <div className="card-title">Weekly Attendance</div>
              <div className="card-badge">Last 7 days</div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={attendanceData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: "white", 
                    border: "1px solid #E5E7EB", 
                    borderRadius: "12px", 
                    boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    fontSize: "14px"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Attendance" 
                  stroke="#4F46E5" 
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#4F46E5", strokeWidth: 2 }} 
                  activeDot={{ r: 7, fill: "#3730A3", stroke: "#FFFFFF", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>
          
          {/* Subject Grade Distribution */}
          <section className="analytics-card">
            <div className="card-header">
              <div className="card-title">Subject Grade Distribution</div>
              <div className="card-badge">Current Semester</div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={gradesData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="subject" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 11, fontWeight: 500 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: "white", 
                    border: "1px solid #E5E7EB", 
                    borderRadius: "12px", 
                    boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    fontSize: "14px"
                  }}
                />
                <Bar dataKey="Grade" radius={[8, 8, 0, 0]}>
                  {gradesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </section>
          
          {/* Performance Breakdown Pie Chart */}
          <section className="analytics-card">
            <div className="card-header">
              <div className="card-title">Performance Breakdown</div>
              <div className="card-badge">Assessment Types</div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  startAngle={90}
                  endAngle={-270}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: "white", 
                    border: "1px solid #E5E7EB", 
                    borderRadius: "12px", 
                    boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    fontSize: "14px"
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: "12px", color: "#6B7280" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </section>
          
          {/* Progress Line Chart */}
          <section className="analytics-card">
            <div className="card-header">
              <div className="card-title">Overall Progress</div>
              <div className="card-badge">Monthly Trend</div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={progressData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: "white", 
                    border: "1px solid #E5E7EB", 
                    borderRadius: "12px", 
                    boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    fontSize: "14px"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Progress" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#10B981", strokeWidth: 2 }} 
                  activeDot={{ r: 7, fill: "#047857", stroke: "#FFFFFF", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>
        </div>
      </main>
      
      <style>{`
        .analytics-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Inter', sans-serif;
          color: #1F2937;
          line-height: 1.5;
        }
        
        .analytics-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #E5E7EB;
          padding: 1.25rem 2rem;
          min-height: 80px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
        
        .analytics-header h1 {
          margin: 0 0 4px 0;
          font-size: 1.75rem;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.025em;
        }
        
        .subtitle {
          font-size: 1rem;
          color: #6366F1;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        
        .profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.25);
        }
        
        .avatar-text {
          color: white;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.05em;
        }
        
        .profile-info {
          display: flex;
          flex-direction: column;
        }
        
        .profile-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 2px;
        }
        
        .profile-role {
          font-size: 0.875rem;
          color: #6B7280;
          font-weight: 500;
        }
        
        .analytics-main {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 0 1rem;
        }
        
        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(250px, 1fr));
          grid-auto-rows: minmax(220px, auto);
          gap: 2rem;
          width: 100%;
          max-width: 1200px;
          margin: 2.5rem auto 2rem auto;
        }
        
        .analytics-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          box-shadow: 0 4px 25px -4px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 0;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .analytics-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -8px rgba(0, 0, 0, 0.15), 0 8px 16px -4px rgba(0, 0, 0, 0.1);
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .card-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1F2937;
          letter-spacing: -0.025em;
        }
        
        .card-badge {
          background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%);
          color: #6B7280;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          .analytics-grid {
            gap: 1.5rem;
            margin: 2rem auto 1.5rem auto;
          }
        }
        
        @media (max-width: 900px) {
          .analytics-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            padding: 1rem 1.5rem;
            min-height: auto;
          }
          
          .analytics-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            margin-top: 1.5rem;
            max-width: 100%;
          }
          
          .analytics-card {
            padding: 1.25rem;
          }
        }
        
        @media (max-width: 640px) {
          .analytics-header {
            padding: 1rem;
          }
          
          .analytics-header h1 {
            font-size: 1.5rem;
          }
          
          .analytics-main {
            padding: 0 0.5rem;
          }
          
          .analytics-grid {
            gap: 1rem;
            margin-top: 1rem;
          }
          
          .analytics-card {
            padding: 1rem;
            border-radius: 16px;
          }
          
          .card-title {
            font-size: 1rem;
          }
          
          .card-badge {
            font-size: 0.7rem;
            padding: 3px 8px;
          }
        }
      `}</style>
    </div>
  );
}

export default Analytics;