import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area, ComposedChart
} from "recharts";

// PS ANALYTICS DATA
const weeklyPSAttendanceData = [
  { day: "Mon", Attendance: 245, Target: 280 },
  { day: "Tue", Attendance: 267, Target: 280 },
  { day: "Wed", Attendance: 252, Target: 280 },
  { day: "Thu", Attendance: 234, Target: 280 },
  { day: "Fri", Attendance: 278, Target: 280 },
  { day: "Sat", Attendance: 265, Target: 280 },
  { day: "Sun", Attendance: 198, Target: 280 },
];

const yearWisePSCompletionData = [
  { year: "2020", Completed: 142, Total: 180, CompletionRate: 78.9 },
  { year: "2021", Completed: 167, Total: 195, CompletionRate: 85.6 },
  { year: "2022", Completed: 189, Total: 210, CompletionRate: 90.0 },
  { year: "2023", Completed: 198, Total: 220, CompletionRate: 90.9 },
  { year: "2024", Completed: 205, Total: 225, CompletionRate: 91.1 },
];

const skillsCompletionData = [
  { skill: "Python", completed: 267, total: 280, percentage: 95.4 },
  { skill: "React.js", completed: 234, total: 280, percentage: 83.6 },
  { skill: "UI/UX Design", completed: 203, total: 280, percentage: 72.5 },
  { skill: "Node.js", completed: 198, total: 280, percentage: 70.7 },
  { skill: "Data Science", completed: 189, total: 280, percentage: 67.5 },
  { skill: "DevOps", completed: 178, total: 280, percentage: 63.6 },
];

const psStatusDistribution = [
  { name: "Completed", value: 65, count: 182 },
  { name: "In Progress", value: 23, count: 64 },
  { name: "Not Started", value: 8, count: 22 },
  { name: "On Hold", value: 4, count: 12 },
];

const departmentPerformanceData = [
  { department: "CSE", projects: 45, completed: 38, inProgress: 7, percentage: 84.4 },
  { department: "ECE", projects: 38, completed: 32, inProgress: 6, percentage: 84.2 },
  { department: "MECH", projects: 28, completed: 22, inProgress: 6, percentage: 78.6 },
  { department: "IT", projects: 42, completed: 35, inProgress: 7, percentage: 83.3 },
  { department: "EEE", projects: 32, completed: 25, inProgress: 7, percentage: 78.1 },
];

const monthlyProgressData = [
  { month: "Jan", projects: 23, submissions: 18, evaluations: 15, revenue: 45000 },
  { month: "Feb", projects: 34, submissions: 28, evaluations: 25, revenue: 52000 },
  { month: "Mar", projects: 45, submissions: 39, evaluations: 35, revenue: 67000 },
  { month: "Apr", projects: 52, submissions: 47, evaluations: 42, revenue: 78000 },
  { month: "May", projects: 48, submissions: 44, evaluations: 40, revenue: 71000 },
  { month: "Jun", projects: 56, submissions: 52, evaluations: 48, revenue: 85000 },
  { month: "Jul", projects: 61, submissions: 58, evaluations: 54, revenue: 92000 },
  { month: "Aug", projects: 58, submissions: 55, evaluations: 51, revenue: 88000 },
  { month: "Sep", projects: 63, submissions: 60, evaluations: 57, revenue: 96000 },
];

const gaugeData = [
  { name: "Current Ratio", value: 2.4, max: 5, color: "#6366f1", suffix: "" },
  { name: "PS Completion", value: 91.1, max: 100, color: "#10b981", suffix: "%" },
  { name: "Skills Average", value: 78.5, max: 100, color: "#f59e0b", suffix: "%" },
  { name: "Department Avg", value: 82.2, max: 100, color: "#ef4444", suffix: "%" },
];

// Professional colors matching enterprise dashboards
const COLORS = {
  primary: "#6366f1",
  success: "#10b981", 
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  secondary: "#6b7280",
  purple: "#8b5cf6",
  teal: "#14b8a6"
};

const CHART_COLORS = [COLORS.primary, COLORS.success, COLORS.warning, COLORS.danger, COLORS.info, COLORS.purple, COLORS.teal, COLORS.secondary];

// Key Performance Metrics with Circular Progress
const KPI_METRICS = [
  { 
    title: 'Overall Performance',
    current: 2.4,
    total: 5,
    percentage: 48,
    color: COLORS.primary,
    unit: ''
  },
  { 
    title: 'Project Completion',
    current: 91.1,
    total: 100,
    percentage: 91.1,
    color: COLORS.success,
    unit: '%'
  },
  { 
    title: 'Skills Assessment',
    current: 78.5,
    total: 100,
    percentage: 78.5,
    color: COLORS.warning,
    unit: '%'
  },
  { 
    title: 'Student Engagement',
    current: 82.2,
    total: 100,
    percentage: 82.2,
    color: COLORS.info,
    unit: '%'
  }
];

// Circular Progress Component
const CircularProgress = ({ percentage, color, size = 120, strokeWidth = 8, current, total, unit, title }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      position: 'relative'
    }}>
      <h3 style={{
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '20px',
        marginTop: '0'
      }}>
        {title}
      </h3>
      
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out'
            }}
          />
        </svg>
        
        {/* Center text */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            lineHeight: '1'
          }}>
            {unit === '' ? `${current}/${total}` : `${current}${unit}`}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            marginTop: '4px'
          }}>
            {percentage.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

// Gauge Chart Component
const GaugeChart = ({ data }) => {
  const { name, value, max, color, suffix } = data;
  const percentage = (value / max) * 100;
  const radius = 70;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius * 0.75; // 3/4 circle
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
      <div style={{ position: 'relative', width: '160px', height: '120px', marginBottom: '16px' }}>
        <svg width="160" height="120" style={{ transform: 'rotate(-135deg)' }}>
          {/* Background arc */}
          <path
            d={`M 20 100 A ${radius} ${radius} 0 0 1 140 100`}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d={`M 20 100 A ${radius} ${radius} 0 0 1 140 100`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        {/* Value text */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
            {value}{suffix}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
            of {max}{suffix}
          </div>
        </div>
      </div>
      <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', textAlign: 'center' }}>
        {name}
      </div>
    </div>
  );
};

function Analytics() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", system-ui, sans-serif',
      color: '#1f2937',
      padding: '20px'
    }}>
      {/* Header */}
      <header style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: '#111827', 
              margin: '0 0 4px 0',
              letterSpacing: '-0.025em'
            }}>
              PS Analytics
            </h1>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280', 
              margin: 0,
              fontWeight: '500'
            }}>
              Professional Skills Training Dashboard
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer'
            }}>
              Export
            </button>
            <button style={{
              padding: '8px 16px',
              backgroundColor: COLORS.primary,
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#ffffff',
              cursor: 'pointer'
            }}>
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {[
          { title: 'Total Students', value: '2,847', change: '+12%', trend: 'up', color: COLORS.primary },
          { title: 'Active Projects', value: '1,234', change: '+8%', trend: 'up', color: COLORS.success },
          { title: 'Completion Rate', value: '91.1%', change: '+2.4%', trend: 'up', color: COLORS.info },
          { title: 'Skills Completed', value: '5,678', change: '+15%', trend: 'up', color: COLORS.warning },
        ].map((kpi, index) => (
          <div key={index} style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>
                {kpi.title}
              </span>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: kpi.color
              }} />
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
              {kpi.value}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: kpi.trend === 'up' ? COLORS.success : COLORS.danger
              }}>
                {kpi.change}
              </span>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                vs last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Key Performance Metrics - Circular Progress */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '16px',
          marginTop: '0'
        }}>
          Key Performance Metrics
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {KPI_METRICS.map((metric, index) => (
            <CircularProgress
              key={index}
              title={metric.title}
              percentage={metric.percentage}
              color={metric.color}
              current={metric.current}
              total={metric.total}
              unit={metric.unit}
            />
          ))}
        </div>
      </div>

      {/* Main Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Large Chart 1 */}
        <div style={{
          gridColumn: 'span 8',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          minHeight: '400px'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
              Monthly Progress Tracking
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Projects, submissions and evaluations over time
            </p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={monthlyProgressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis 
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar yAxisId="left" dataKey="projects" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke={COLORS.success} strokeWidth={3} dot={{ r: 4 }} />
              <Legend />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Gauge Charts */}
        <div style={{
          gridColumn: 'span 4',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          minHeight: '400px'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
              Key Performance Metrics
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Real-time performance indicators
            </p>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '16px',
            height: '300px'
          }}>
            {gaugeData.map((data, index) => (
              <GaugeChart key={index} data={data} />
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Skills Chart */}
        <div style={{
          gridColumn: 'span 4',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          minHeight: '350px'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
              Skills Completion
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Top performing skills
            </p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={skillsCompletionData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis type="category" dataKey="skill" axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 11 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="completed" radius={[0, 4, 4, 0]}>
                {skillsCompletionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div style={{
          gridColumn: 'span 4',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          minHeight: '350px'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
              PS Status Distribution
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Current project status
            </p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={psStatusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {psStatusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Performance */}
        <div style={{
          gridColumn: 'span 4',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          minHeight: '350px'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
              Department Performance
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Success rates by department
            </p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={departmentPerformanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area type="monotone" dataKey="percentage" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;