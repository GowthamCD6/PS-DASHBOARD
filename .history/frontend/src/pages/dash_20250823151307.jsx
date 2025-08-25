import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  Filter,
  ArrowUp,
  ArrowDown,
  X,
  Target,
} from "lucide-react";

// API services commented out for now
// import { studentService } from '../services';
// import { useApiCall } from '../hooks/useApiCall';

const initialStudents = [
  {
    id: 1,
    name: "Jon Snow",
    regNo: "2021CSE001",
    department: "CSE",
    year: "III",
    totalLevels: 10,
    completedLevels: 7,
    cumulativeRewards: 850,
    currentSemRewards: 120,
    skills: {
      JavaScript: { level: 8, daysAgo: 3 },
      Python: { level: 6, daysAgo: 7 },
      React: { level: 7, daysAgo: 5 },
    },
  },
  {
    id: 2,
    name: "Cersei Lannister",
    regNo: "2021IT002",
    department: "IT",
    year: "III",
    totalLevels: 10,
    completedLevels: 9,
    cumulativeRewards: 1200,
    currentSemRewards: 180,
    skills: {
      JavaScript: { level: 9, daysAgo: 1 },
      Python: { level: 8, daysAgo: 2 },
      React: { level: 6, daysAgo: 4 },
    },
  },
  {
    id: 3,
    name: "Jaime Lannister",
    regNo: "2022ECE003",
    department: "ECE",
    year: "II",
    totalLevels: 10,
    completedLevels: 4,
    cumulativeRewards: 420,
    currentSemRewards: 65,
    skills: {
      JavaScript: { level: 5, daysAgo: 12 },
      Python: { level: 4, daysAgo: 15 },
      React: { level: 3, daysAgo: 18 },
    },
  },
  {
    id: 4,
    name: "Arya Stark",
    regNo: "2020EEE004",
    department: "EEE",
    year: "IV",
    totalLevels: 10,
    completedLevels: 10,
    cumulativeRewards: 1500,
    currentSemRewards: 220,
    skills: {
      JavaScript: { level: 10, daysAgo: 999 },
      Python: { level: 9, daysAgo: 1 },
      React: { level: 8, daysAgo: 2 },
    },
  },
  {
    id: 5,
    name: "Daenerys Targaryen",
    regNo: "2021MECH005",
    department: "MECH",
    year: "III",
    totalLevels: 10,
    completedLevels: 6,
    cumulativeRewards: 680,
    currentSemRewards: 95,
    skills: {
      JavaScript: { level: 5, daysAgo: 18 },
      Python: { level: 8, daysAgo: 6 },
      React: { level: 4, daysAgo: 20 },
    },
  },
];

const availableSkills = [
  "JavaScript",
  "Python",
  "React",
  "Java",
  "C++",
  "Node.js",
  "Angular",
  "Vue.js",
];

const Dash = () => {
  // Simplified state management - no API for now
  const [students, setStudents] = useState(initialStudents);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [filters, setFilters] = useState({
    role: "all",
    year: "all",
    department: "all",
  });

  const [nameSearch, setNameSearch] = useState("");
  const [regNoSearch, setRegNoSearch] = useState("");
  const [cumulativeFilter, setCumulativeFilter] = useState({
    type: "all",
    value: "",
  });
  const [currentSemFilter, setCurrentSemFilter] = useState({
    type: "all",
    value: "",
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const [skillSortConfig, setSkillSortConfig] = useState({
    skill: null,
    direction: "asc",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([
    "JavaScript",
    "Python",
    "React",
  ]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSkillSort = (skill) => {
    let direction = "asc";
    if (skillSortConfig.skill === skill && skillSortConfig.direction === "asc") {
      direction = "desc";
    }
    setSkillSortConfig({ skill, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUp className="w-3 h-3 opacity-40" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-3 h-3" />
    ) : (
      <ArrowDown className="w-3 h-3" />
    );
  };

  const getSkillSortIcon = (skill) => {
    if (skillSortConfig.skill !== skill) {
      return <ArrowUp className="w-3 h-3 opacity-40" />;
    }
    return skillSortConfig.direction === "asc" ? (
      <ArrowUp className="w-3 h-3" />
    ) : (
      <ArrowDown className="w-3 h-3" />
    );
  };

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter((student) => {
      const nameMatch = student.name
        .toLowerCase()
        .includes(nameSearch.toLowerCase());
      const regNoMatch = student.regNo
        .toLowerCase()
        .includes(regNoSearch.toLowerCase());
      const yearMatch = filters.year === "all" || student.year === filters.year;
      const deptMatch =
        filters.department === "all" || student.department === filters.department;

      let cumulativeMatch = true;
      if (cumulativeFilter.type !== "all" && cumulativeFilter.value) {
        const value = parseFloat(cumulativeFilter.value);
        switch (cumulativeFilter.type) {
          case "greater":
            cumulativeMatch = student.cumulativeRewards > value;
            break;
          case "less":
            cumulativeMatch = student.cumulativeRewards < value;
            break;
          case "equal":
            cumulativeMatch = student.cumulativeRewards === value;
            break;
        }
      }

      let currentSemMatch = true;
      if (currentSemFilter.type !== "all" && currentSemFilter.value) {
        const value = parseFloat(currentSemFilter.value);
        switch (currentSemFilter.type) {
          case "greater":
            currentSemMatch = student.currentSemRewards > value;
            break;
          case "less":
            currentSemMatch = student.currentSemRewards < value;
            break;
          case "equal":
            currentSemMatch = student.currentSemRewards === value;
            break;
        }
      }

      return (
        nameMatch &&
        regNoMatch &&
        yearMatch &&
        deptMatch &&
        cumulativeMatch &&
        currentSemMatch
      );
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    // Apply skill sorting
    if (skillSortConfig.skill) {
      filtered.sort((a, b) => {
        const aSkill = a.skills[skillSortConfig.skill];
        const bSkill = b.skills[skillSortConfig.skill];
        const aLevel = aSkill ? aSkill.level : 0;
        const bLevel = bSkill ? bSkill.level : 0;

        if (aLevel < bLevel) {
          return skillSortConfig.direction === "asc" ? -1 : 1;
        }
        if (aLevel > bLevel) {
          return skillSortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [
    students,
    nameSearch,
    regNoSearch,
    filters,
    cumulativeFilter,
    currentSemFilter,
    sortConfig,
    skillSortConfig,
  ]);

  const getSkillColor = (level, daysAgo) => {
    if (daysAgo > 30) return "#ef4444"; // Red for > 30 days
    if (daysAgo > 14) return "#f59e0b"; // Orange for > 14 days
    if (daysAgo > 7) return "#eab308"; // Yellow for > 7 days
    return "#10b981"; // Green for recent
  };

  const getSkillBgColor = (level, daysAgo) => {
    if (daysAgo > 30) return "#fef2f2"; // Light red
    if (daysAgo > 14) return "#fffbeb"; // Light orange
    if (daysAgo > 7) return "#fefce8"; // Light yellow
    return "#f0fdf4"; // Light green
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "#10b981";
    if (percentage >= 60) return "#eab308";
    if (percentage >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const resetFilters = () => {
    setFilters({ role: "all", year: "all", department: "all" });
    setNameSearch("");
    setRegNoSearch("");
    setCumulativeFilter({ type: "all", value: "" });
    setCurrentSemFilter({ type: "all", value: "" });
    setSortConfig({ key: null, direction: "asc" });
    setSkillSortConfig({ skill: null, direction: "asc" });
  };

  const clearSearch = () => {
    setNameSearch("");
    setRegNoSearch("");
  };

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const removeSkill = (skill) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Student Dashboard
          </h1>
          <p className="text-gray-600">
            Track student progress and skill development
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={nameSearch}
                  onChange={(e) => setNameSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by reg no..."
                  value={regNoSearch}
                  onChange={(e) => setRegNoSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
                />
              </div>
              {(nameSearch || regNoSearch) && (
                <button
                  onClick={clearSearch}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <select
                    value={filters.year}
                    onChange={(e) =>
                      setFilters({ ...filters, year: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="all">All Years</option>
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                  </select>
                </div>

                {/* Department Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={filters.department}
                    onChange={(e) =>
                      setFilters({ ...filters, department: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="all">All Departments</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                  </select>
                </div>

                {/* Cumulative Rewards Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cumulative Rewards
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={cumulativeFilter.type}
                      onChange={(e) =>
                        setCumulativeFilter({
                          ...cumulativeFilter,
                          type: e.target.value,
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="all">All</option>
                      <option value="greater">{">"}</option>
                      <option value="less">{"<"}</option>
                      <option value="equal">{"="}</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Value"
                      value={cumulativeFilter.value}
                      onChange={(e) =>
                        setCumulativeFilter({
                          ...cumulativeFilter,
                          value: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Current Semester Rewards Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Sem Rewards
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={currentSemFilter.type}
                      onChange={(e) =>
                        setCurrentSemFilter({
                          ...currentSemFilter,
                          type: e.target.value,
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="all">All</option>
                      <option value="greater">{">"}</option>
                      <option value="less">{"<"}</option>
                      <option value="equal">{"="}</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Value"
                      value={currentSemFilter.value}
                      onChange={(e) =>
                        setCurrentSemFilter({
                          ...currentSemFilter,
                          value: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Skill Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:text-blue-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSkills
                    .filter((skill) => !selectedSkills.includes(skill))
                    .map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-3 h-3 inline mr-1" />
                        {skill}
                      </button>
                    ))}
                </div>
              </div>

              {/* Reset Filters */}
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Showing {filteredAndSortedStudents.length} of {students.length}{" "}
              students
            </span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Total Levels: {students.reduce((sum, s) => sum + s.totalLevels, 0)}
              </span>
              <span className="text-sm text-gray-600">
                Completed: {students.reduce((sum, s) => sum + s.completedLevels, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {/* Name */}
                  <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Name</span>
                      <button
                        onClick={() => handleSort("name")}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                      >
                        {getSortIcon("name")}
                      </button>
                    </div>
                  </th>

                  {/* Reg No */}
                  <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Reg No</span>
                      <button
                        onClick={() => handleSort("regNo")}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                      >
                        {getSortIcon("regNo")}
                      </button>
                    </div>
                  </th>

                  {/* Department */}
                  <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Department</span>
                      <button
                        onClick={() => handleSort("department")}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                      >
                        {getSortIcon("department")}
                      </button>
                    </div>
                  </th>

                  {/* Year */}
                  <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Year</span>
                      <button
                        onClick={() => handleSort("year")}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                      >
                        {getSortIcon("year")}
                      </button>
                    </div>
                  </th>

                  {/* Progress */}
                  <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Progress</span>
                      <button
                        onClick={() => handleSort("completedLevels")}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                      >
                        {getSortIcon("completedLevels")}
                      </button>
                    </div>
                  </th>

                  {/* Cumulative Rewards */}
                  <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Cumulative</span>
                      <button
                        onClick={() => handleSort("cumulativeRewards")}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                      >
                        {getSortIcon("cumulativeRewards")}
                      </button>
                    </div>
                  </th>

                  {/* Current Sem */}
                  <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Current Sem</span>
                      <button
                        onClick={() => handleSort("currentSemRewards")}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                      >
                        {getSortIcon("currentSemRewards")}
                      </button>
                    </div>
                  </th>

                  {/* Skills */}
                  {selectedSkills.map((skill) => (
                    <th
                      key={skill}
                      className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-2">
                        <span>{skill}</span>
                        <button
                          onClick={() => handleSkillSort(skill)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors"
                        >
                          {getSkillSortIcon(skill)}
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    {/* Name */}
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Reg No */}
                    <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.regNo}
                    </td>

                    {/* Department */}
                    <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {student.department}
                      </span>
                    </td>

                    {/* Year */}
                    <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.year}
                    </td>

                    {/* Progress */}
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(student.completedLevels / student.totalLevels) * 100}%`,
                              backgroundColor: getProgressColor(
                                (student.completedLevels / student.totalLevels) * 100
                              ),
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {student.completedLevels}/{student.totalLevels}
                        </span>
                      </div>
                    </td>

                    {/* Cumulative Rewards */}
                    <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center">
                        <Target className="w-4 h-4 text-yellow-500 mr-1" />
                        {student.cumulativeRewards}
                      </span>
                    </td>

                    {/* Current Sem */}
                    <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center">
                        <Target className="w-4 h-4 text-green-500 mr-1" />
                        {student.currentSemRewards}
                      </span>
                    </td>

                    {/* Skills */}
                    {selectedSkills.map((skill) => {
                      const studentSkill = student.skills[skill];
                      return (
                        <td key={skill} className="px-8 py-4 whitespace-nowrap">
                          {studentSkill ? (
                            <div
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                              style={{
                                color: getSkillColor(
                                  studentSkill.level,
                                  studentSkill.daysAgo
                                ),
                                backgroundColor: getSkillBgColor(
                                  studentSkill.level,
                                  studentSkill.daysAgo
                                ),
                              }}
                            >
                              Lv.{studentSkill.level}
                              {studentSkill.daysAgo < 999 && (
                                <span className="ml-1 text-xs opacity-75">
                                  ({studentSkill.daysAgo}d)
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredAndSortedStudents.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No students found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or filters to find students.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dash;
    totalLevels: 10,
    completedLevels: 10,
    cumulativeRewards: 1500,
    currentSemRewards: 220,
    skills: {
      JavaScript: { level: 10, daysAgo: 999 },
      Python: { level: 9, daysAgo: 1 },
      React: { level: 8, daysAgo: 2 },
    },
  },
  {
    id: 5,
    name: "Daenerys Targaryen",
    regNo: "2021MECH005",
    department: "MECH",
    year: "III",
    totalLevels: 10,
    completedLevels: 6,
    cumulativeRewards: 680,
    currentSemRewards: 95,
    skills: {
      JavaScript: { level: 5, daysAgo: 18 },
      Python: { level: 8, daysAgo: 6 },
      React: { level: 4, daysAgo: 20 },
    },
  },
];

const availableSkills = [
  "JavaScript",
  "Python",
  "React",
  "Java",
  "C++",
  "Node.js",
  "Angular",
  "Vue.js",
];

const Dash = () => {
  // Simplified state management - no API for now
  const [students, setStudents] = useState(initialStudents);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [filters, setFilters] = useState({
    role: "all",
    year: "all",
    department: "all",
  });

  const [nameSearch, setNameSearch] = useState("");
  const [regNoSearch, setRegNoSearch] = useState("");
  const [cumulativeFilter, setCumulativeFilter] = useState({
    type: "all",
    value: "",
  });
  const [currentSemFilter, setCurrentSemFilter] = useState({
    type: "all",
    value: "",
  });

  const [skillColumns, setSkillColumns] = useState([
    { id: "skill1", skill: "JavaScript", levelFilter: "" },
    { id: "skill2", skill: "Python", levelFilter: "" },
  ]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [showNameSearch, setShowNameSearch] = useState(false);
  const [showRegNoSearch, setShowRegNoSearch] = useState(false);
  const [showCumulativeFilter, setShowCumulativeFilter] = useState(false);
  const [showCurrentSemFilter, setShowCurrentSemFilter] = useState(false);

  // MUI Popover states
  const [cumulativeAnchorEl, setCumulativeAnchorEl] = useState(null);
  const [cumulativePopoverFilter, setCumulativePopoverFilter] = useState({
    type: "all",
    value: "",
  });
  const [currentSemAnchorEl, setCurrentSemAnchorEl] = useState(null);
  const [currentSemPopoverFilter, setCurrentSemPopoverFilter] = useState({
    type: "all",
    value: "",
  });
  const [nameAnchorEl, setNameAnchorEl] = useState(null);
  const [regNoAnchorEl, setRegNoAnchorEl] = useState(null);

  // MUI Popover handlers
  const handleCumulativeOpen = (event) =>
    setCumulativeAnchorEl(event.currentTarget);
  const handleCumulativeClose = () => setCumulativeAnchorEl(null);
  const handleCumulativeApply = () => {
    setCumulativeFilter({
      type: cumulativePopoverFilter.type,
      value: cumulativePopoverFilter.value,
    });
    handleCumulativeClose();
  };
  const handleCumulativeClear = () => {
    setCumulativePopoverFilter({ type: "all", value: "" });
    setCumulativeFilter({ type: "all", value: "" });
    handleCumulativeClose();
  };

  const handleCurrentSemOpen = (event) =>
    setCurrentSemAnchorEl(event.currentTarget);
  const handleCurrentSemClose = () => setCurrentSemAnchorEl(null);
  const handleCurrentSemApply = () => {
    setCurrentSemFilter({
      type: currentSemPopoverFilter.type,
      value: currentSemPopoverFilter.value,
    });
    handleCurrentSemClose();
  };
  const handleCurrentSemClear = () => {
    setCurrentSemPopoverFilter({ type: "all", value: "" });
    setCurrentSemFilter({ type: "all", value: "" });
    handleCurrentSemClose();
  };

  const handleNameOpen = (event) => setNameAnchorEl(event.currentTarget);
  const handleNameClose = () => setNameAnchorEl(null);

  const handleRegNoOpen = (event) => setRegNoAnchorEl(event.currentTarget);
  const handleRegNoClose = () => setRegNoAnchorEl(null);

  // Fetch students data on component mount - COMMENTED OUT FOR NOW
  // useEffect(() => {
  //   const fetchStudents = async () => {
  //     try {
  //       const result = await executeApiCall(studentService.getAllUsers);
  //       if (result.success) {
  //         setStudents(result.data || []);
  //         setSnackbar({
  //           open: true,
  //           message: 'Students data loaded successfully',
  //           severity: 'success'
  //         });
  //       } else {
  //         setSnackbar({
  //           open: true,
  //           message: result.message || 'Failed to load students data',
  //           severity: 'error'
  //         });
  //         // Keep using initial students data as fallback
  //       }
  //     } catch (error) {
  //       console.error('Error fetching students:', error);
  //       setSnackbar({
  //         open: true,
  //         message: 'Using demo data - API not available',
  //         severity: 'warning'
  //       });
  //       // Keep using initial students data
  //     }
  //   };

  //   fetchStudents();
  // }, [executeApiCall]);

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
    // clearError();
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".filter-popup")) {
        setShowNameSearch(false);
        setShowRegNoSearch(false);
        setShowCumulativeFilter(false);
        setShowCurrentSemFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get level badge color
  const getLevelBadgeColor = (level) => {
    if (level >= 9) return "#059669"; // emerald-600
    if (level >= 7) return "#16a34a"; // green-600
    if (level >= 5) return "#ca8a04"; // yellow-600
    if (level >= 3) return "#ea580c"; // orange-600
    return "#dc2626"; // red-600
  };

  // Get days ago color
  const getDaysColor = (days) => {
    if (days <= 3) return "#10b981"; // green-500
    if (days <= 7) return "#84cc16"; // lime-500
    if (days <= 15) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  };

  // Filter students
  const filteredStudents = useMemo(() => {
    if (!students || !Array.isArray(students)) return [];

    return students.filter((student) => {
      // Ensure student has required properties
      if (!student || !student.skills) return false;

      // Basic filters
      if (filters.role !== "all" && filters.role !== "all") return false;
      if (filters.year !== "all" && student.year !== filters.year) return false;
      if (
        filters.department !== "all" &&
        student.department !== filters.department
      )
        return false;

      // Search filters
      if (
        nameSearch &&
        !student.name.toLowerCase().includes(nameSearch.toLowerCase())
      )
        return false;
      if (
        regNoSearch &&
        !student.regNo.toLowerCase().includes(regNoSearch.toLowerCase())
      )
        return false;

      // Reward filters
      if (cumulativeFilter.type !== "all" && cumulativeFilter.value) {
        const value = parseInt(cumulativeFilter.value);
        if (
          cumulativeFilter.type === "equal" &&
          student.cumulativeRewards !== value
        )
          return false;
        if (
          cumulativeFilter.type === "greater" &&
          student.cumulativeRewards <= value
        )
          return false;
        if (
          cumulativeFilter.type === "less" &&
          student.cumulativeRewards >= value
        )
          return false;
      }

      if (currentSemFilter.type !== "all" && currentSemFilter.value) {
        const value = parseInt(currentSemFilter.value);
        if (
          currentSemFilter.type === "equal" &&
          student.currentSemRewards !== value
        )
          return false;
        if (
          currentSemFilter.type === "greater" &&
          student.currentSemRewards <= value
        )
          return false;
        if (
          currentSemFilter.type === "less" &&
          student.currentSemRewards >= value
        )
          return false;
      }

      // Skill filters
      for (const skillCol of skillColumns) {
        if (skillCol.levelFilter) {
          const skillData = student.skills && student.skills[skillCol.skill];
          const studentLevel = skillData ? skillData.level : 0;
          if (studentLevel !== parseInt(skillCol.levelFilter)) return false;
        }
      }

      return true;
    });
  }, [
    students,
    filters,
    nameSearch,
    regNoSearch,
    cumulativeFilter,
    currentSemFilter,
    skillColumns,
  ]);

  // Sort students
  const sortedStudents = useMemo(() => {
    if (!filteredStudents || !Array.isArray(filteredStudents)) return [];
    if (!sortConfig.key || !sortConfig.direction) return filteredStudents;

    return [...filteredStudents].sort((a, b) => {
      let aVal, bVal;

      if (sortConfig.key === "completedLevels") {
        aVal = a.completedLevels;
        bVal = b.completedLevels;
      } else if (sortConfig.key === "name") {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (sortConfig.key === "regNo") {
        aVal = a.regNo.toLowerCase();
        bVal = b.regNo.toLowerCase();
      } else if (sortConfig.key === "cumulativeRewards") {
        aVal = a.cumulativeRewards;
        bVal = b.cumulativeRewards;
      } else if (sortConfig.key === "currentSemRewards") {
        aVal = a.currentSemRewards;
        bVal = b.currentSemRewards;
      } else if (sortConfig.key.startsWith("skill_")) {
        const skillId = sortConfig.key.replace("skill_", "");
        const skillCol = skillColumns.find((col) => col.id === skillId);
        if (skillCol) {
          aVal = a.skills[skillCol.skill]?.level || 0;
          bVal = b.skills[skillCol.skill]?.level || 0;
        }
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredStudents, sortConfig, skillColumns]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) {
        return { key, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      if (prev.direction === "desc") {
        return { key: null, direction: null };
      }
      return { key, direction: "asc" };
    });
  };

  const addSkillColumn = () => {
    const newId = `skill${skillColumns.length + 1}`;
    setSkillColumns([
      ...skillColumns,
      { id: newId, skill: "", levelFilter: "" },
    ]);
  };

  const updateSkillColumn = async (id, field, value) => {
    setSkillColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, [field]: value } : col))
    );

    // If updating skill name and it's not empty, you could call API here
    if (field === "skill" && value.trim()) {
      try {
        // Optional: Auto-save skill changes to backend
        // await executeApiCall(studentService.updateSkill, id, { [field]: value });
      } catch (error) {
        console.error("Error updating skill:", error);
      }
    }
  };

  const removeSkillColumn = async (id) => {
    try {
      // Optional: Call API to delete skill from backend
      // await executeApiCall(studentService.deleteSkill, id);

      setSkillColumns((prev) => prev.filter((col) => col.id !== id));

      setSnackbar({
        open: true,
        message: "Skill column removed successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to remove skill column",
        severity: "error",
      });
    }
  };

  // Refresh data function - COMMENTED OUT FOR NOW
  // const refreshData = async () => {
  //   try {
  //     const result = await executeApiCall(studentService.getAllUsers);
  //     if (result.success) {
  //       setStudents(result.data || []);
  //       setSnackbar({
  //         open: true,
  //         message: 'Data refreshed successfully',
  //         severity: 'success'
  //       });
  //     } else {
  //       setSnackbar({
  //         open: true,
  //         message: 'Failed to refresh data',
  //         severity: 'error'
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error refreshing data:', error);
  //     setSnackbar({
  //       open: true,
  //       message: 'Refresh failed - using current data',
  //       severity: 'warning'
  //     });
  //   }
  // };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronDown size={12} color="#9ca3af" />;
    }
    if (sortConfig.direction === "asc") {
      return <ArrowUp size={12} color="#2563eb" />;
    }
    if (sortConfig.direction === "desc") {
      return <ArrowDown size={12} color="#2563eb" />;
    }
    return <ChevronDown size={12} color="#9ca3af" />;
  };

  const styles = {
    container: {
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#f8fafc",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      display: "flex",
      flexDirection: "column",
      position: "relative",
      top: "-30px",
    },
    header: {
      padding: "20px 35px",
      borderBottom: "1px solid #e2e8f0",
      backgroundColor: "white",
      margin: "0",
    },
    title: {
      fontSize: "36px",
      fontWeight: "600",
      color: "#475569",
      margin: "0 0 8px 0",
      letterSpacing: "-0.025em",
      lineHeight: "1.1",
    },
    filtersContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      padding: "20px",
      margin: "24px 32px 0",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    },
    filtersRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "24px",
      maxWidth: "100%",
    },
    filtersLeft: {
      display: "flex",
      alignItems: "center",
      gap: "32px",
      flexWrap: "wrap",
    },
    filterGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      minWidth: "120px",
    },
    filterLabel: {
      fontSize: "11px",
      fontWeight: "600",
      color: "#64748b",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      marginBottom: "2px",
    },
    select: {
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      padding: "8px 12px",
      fontSize: "14px",
      minWidth: "140px",
      width: "100%",
      backgroundColor: "white",
      cursor: "pointer",
      color: "#334155",
      fontWeight: "500",
      transition: "border-color 0.2s, box-shadow 0.2s",
    },
    addButton: {
      backgroundColor: "#3b82f6",
      color: "white",
      padding: "12px 20px",
      borderRadius: "8px",
      border: "none",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.2s",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    },
    tableContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      overflow: "hidden",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      margin: "24px 32px",
      flex: "1",
    },
    tableWrapper: {
      overflowX: "auto",
      width: "100%",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    thead: {
      backgroundColor: "#f8fafc",
      borderBottom: "1px solid #e2e8f0",
    },
    th: {
      padding: "16px 32px",
      textAlign: "left",
      fontSize: "12px",
      fontWeight: "600",
      color: "#475569",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      borderBottom: "1px solid #e2e8f0",
    },
    thContent: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    sortButton: {
      padding: "4px",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    filterButton: {
      padding: "4px",
      border: "1px solid #d1d5db",
      backgroundColor: "white",
      cursor: "pointer",
      borderRadius: "4px",
      marginLeft: "4px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#6b7280",
      transition: "all 0.2s",
    },
    tbody: {
      backgroundColor: "white",
    },
    tr: {
      borderBottom: "1px solid #f1f5f9",
      transition: "background-color 0.2s",
    },
    td: {
      padding: "16px 32px",
      fontSize: "14px",
      color: "#334155",
      verticalAlign: "middle",
    },
    completedBadge: {
      backgroundColor: "#f1f5f9",
      padding: "6px 12px",
      borderRadius: "6px",
      color: "#475569",
      fontSize: "13px",
      fontWeight: "500",
    },
    nameCell: {
      display: "flex",
      flexDirection: "column",
    },
    nameMain: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#334155",
    },
    nameSubtle: {
      fontSize: "13px",
      color: "#64748b",
      marginTop: "2px",
    },
    rewardPoints: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#3b82f6",
    },
    skillCell: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "4px",
    },
    searchPopup: {
      position: "absolute",
      top: "100%",
      left: "0",
      zIndex: 1000,
      backgroundColor: "white",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      padding: "12px",
      minWidth: "200px",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
    searchInputPopup: {
      width: "100%",
      border: "1px solid #2563eb",
      borderRadius: "6px",
      padding: "8px 12px",
      fontSize: "14px",
    },
    modernFilterPopup: {
      position: "absolute",
      top: "calc(100% + 8px)",
      left: 0,
      zIndex: 1000,
      backgroundColor: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "16px",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      minWidth: "280px",
    },
    modernFilterTitle: {
      fontSize: "16px",
      fontWeight: "500",
      color: "#111827",
      marginBottom: "12px",
    },
    modernFilterRow: {
      display: "flex",
      gap: "12px",
      marginBottom: "12px",
    },
    modernFilterSelect: {
      flex: "1",
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: "white",
      cursor: "pointer",
      outline: "none",
    },
    modernFilterInput: {
      flex: "1",
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "14px",
      outline: "none",
    },
    modernFilterButtons: {
      display: "flex",
      gap: "8px",
      justifyContent: "flex-end",
    },
    modernClearButton: {
      padding: "8px 16px",
      backgroundColor: "#f9fafb",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "14px",
      cursor: "pointer",
      color: "#374151",
    },
    thWithFilter: {
      position: "relative",
    },
    levelBadge: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "600",
      color: "white",
      minWidth: "40px",
    },
    daysAgo: {
      fontSize: "12px",
    },
  };

  // Loading state removed for now since API is commented out

  return (
    <div style={styles.container}>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Student Skills Dashboard</h1>
      </div>

      {/* Filters */}
      <div style={styles.filtersContainer}>
        <div style={styles.filtersRow}>
          <div style={styles.filtersLeft}>
            {/* Role Filter */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="role-select-label">ROLE</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={filters.role}
                label="ROLE"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, role: e.target.value }))
                }
                size="small"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  fontSize: "14px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#d1d5db" },
                    "&:hover fieldset": { borderColor: "#3b82f6" },
                    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                  },
                  "& .MuiSelect-select": {
                    color: "#334155",
                    fontWeight: "500",
                  },
                }}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="faculty">Faculty</MenuItem>
                <MenuItem value="hod">HOD</MenuItem>
              </Select>
            </FormControl>

            {/* Year Filter */}
            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel id="year-select-label">YEAR</InputLabel>
              <Select
                labelId="year-select-label"
                id="year-select"
                value={filters.year}
                label="YEAR"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, year: e.target.value }))
                }
                size="small"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  fontSize: "14px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#d1d5db" },
                    "&:hover fieldset": { borderColor: "#3b82f6" },
                    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                  },
                  "& .MuiSelect-select": {
                    color: "#334155",
                    fontWeight: "500",
                  },
                }}
              >
                <MenuItem value="all">All Years</MenuItem>
                <MenuItem value="I">I Year</MenuItem>
                <MenuItem value="II">II Year</MenuItem>
                <MenuItem value="III">III Year</MenuItem>
                <MenuItem value="IV">IV Year</MenuItem>
              </Select>
            </FormControl>

            {/* Department Filter */}
            <FormControl sx={{ minWidth: 230 }}>
              <InputLabel id="department-select-label">DEPARTMENT</InputLabel>
              <Select
                labelId="department-select-label"
                id="department-select"
                value={filters.department}
                label="DEPARTMENT"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
                size="small"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  fontSize: "14px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#d1d5db" },
                    "&:hover fieldset": { borderColor: "#3b82f6" },
                    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                  },
                  "& .MuiSelect-select": {
                    color: "#334155",
                    fontWeight: "500",
                  },
                }}
              >
                <MenuItem value="all">All Departments</MenuItem>
                <MenuItem value="CSE">CSE</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="ECE">ECE</MenuItem>
                <MenuItem value="EEE">EEE</MenuItem>
                <MenuItem value="MECH">MECH</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Add Skill Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addSkillColumn}
            sx={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "12px 20px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "none",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#2563eb",
                boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            Add Skill Column
          </Button>
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                {/* Total Levels */}
                <th
                  style={{ ...styles.th, fontSize: "14px", fontWeight: "600" }}
                >
                  Total Levels
                </th>

                {/* Completed */}
                <th
                  style={{
                    ...styles.th,
                    ...styles.thWithFilter,
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  <div style={styles.thContent}>
                    Completed
                    <button
                      onClick={() => handleSort("completedLevels")}
                      style={styles.sortButton}
                    >
                      {getSortIcon("completedLevels")}
                    </button>
                  </div>
                </th>

                {/* Name */}
                <th
                  style={{
                    ...styles.th,
                    fontWeight: "600",
                    backgroundColor: "#f8fafc",
                    padding: "16px 32px",
                    fontSize: "14px",
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid #e2e8f0",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ lineHeight: 1.2 }}>Name</span>
                    </div>

                    <button
                      onClick={() => handleSort("name")}
                      style={{
                        marginLeft: '8px',
                        padding: "4px",
                        borderRadius: "4px",
                        border: "none",
                        backgroundColor: "transparent",
                        color: "#6b7280",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#f3f4f6";
                        e.currentTarget.style.color = "#3b82f6";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#6b7280";
                      }}
                    >
                      {getSortIcon("name")}
                    </button>
                  </div>
                </th>
                    <span style={{ whiteSpace: "nowrap" }}>Name</span>
                  </Box>

                  <IconButton
                    aria-describedby={
                      Boolean(nameAnchorEl) ? "name-filter-popover" : undefined
                    }
                    size="small"
                    onClick={handleNameOpen}
                    sx={{
                      position: "absolute", // Position icon in the corner
                      top: "50%",
                      right: "5px", // Align with cell padding
                      transform: "translateY(-50%)",
                      padding: "4px",
                      backgroundColor: "transparent",
                      borderRadius: "4px",
                      color: "#6b7280",
                      marginLeft: "40px",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        color: "#3b82f6",
                      },
                      "&:active": {
                        transform: "translateY(-50%) scale(0.95)",
                      },
                    }}
                  >
                    <FilterListIcon sx={{ fontSize: "18px" }} />
                  </IconButton>

                  <Popover
                    id={
                      Boolean(nameAnchorEl) ? "name-filter-popover" : undefined
                    }
                    open={Boolean(nameAnchorEl)}
                    anchorEl={nameAnchorEl}
                    onClose={handleNameClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <Box sx={{ p: 2 }}>
                      <TextField
                        placeholder="Search by name..."
                        variant="standard"
                        value={nameSearch}
                        onChange={(e) => setNameSearch(e.target.value)}
                        autoFocus
                        sx={{
                          "& .MuiInput-underline:before": {
                            borderBottomColor: "#d1d5db",
                          },
                          "& .MuiInput-underline:hover:before": {
                            borderBottomColor: "#3b82f6",
                          },
                          "& .MuiInput-underline:after": {
                            borderBottomColor: "#3b82f6",
                          },
                          "& .MuiInputBase-input": {
                            fontSize: "14px",
                            color: "#374151",
                          },
                          "& .MuiInputBase-input::placeholder": {
                            color: "#9ca3af",
                            opacity: 1,
                          },
                        }}
                      />
                    </Box>
                  </Popover>
                </TableCell>

                {/* Reg No */}
                <TableCell
                  sx={{
                    fontWeight: "600",
                    backgroundColor: "#f8fafc",
                    padding: "16px 32px",
                    fontSize: "14px",
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid #e2e8f0",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center", // Center the text
                      width: "100%",
                    }}
                  >
                    <span style={{ whiteSpace: "nowrap" }}>Reg No</span>
                  </Box>

                  <IconButton
                    aria-describedby={
                      Boolean(regNoAnchorEl)
                        ? "reg-no-filter-popover"
                        : undefined
                    }
                    size="small"
                    onClick={handleRegNoOpen}
                    sx={{
                      position: "absolute", // Position icon in the corner
                      top: "50%",
                      right: "5px", // Align with cell padding
                      transform: "translateY(-50%)",
                      padding: "4px",
                      backgroundColor: "transparent",
                      borderRadius: "4px",
                      color: "#6b7280",
                      transition: "all 0.2s ease",
                      marginLeft: "40px",
                      "&:hover": {
                        // backgroundColor: '#f3f4f6',
                        color: "#3b82f6",
                      },
                      "&:active": {
                        transform: "translateY(-50%) scale(0.95)",
                      },
                    }}
                  >
                    <FilterListIcon sx={{ fontSize: "18px" }} />
                  </IconButton>

                  <Popover
                    id={
                      Boolean(regNoAnchorEl)
                        ? "reg-no-filter-popover"
                        : undefined
                    }
                    open={Boolean(regNoAnchorEl)}
                    anchorEl={regNoAnchorEl}
                    onClose={handleRegNoClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    PaperProps={{
                      sx: {
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        boxShadow:
                          "0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.03)",
                        backgroundColor: "#ffffff",
                        overflow: "hidden",
                        minWidth: "280px",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 2.5,
                        borderBottom: "1px solid #f1f5f9",
                        backgroundColor: "#fafbfc",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: "600",
                          fontSize: "14px",
                          color: "#1f2937",
                          margin: 0,
                          textAlign: "center",
                        }}
                      >
                        Search by Registration Number
                      </Typography>
                    </Box>
                    <Box sx={{ p: 3 }}>
                      <TextField
                        placeholder="Enter registration number..."
                        variant="outlined"
                        size="small"
                        value={regNoSearch}
                        onChange={(e) => setRegNoSearch(e.target.value)}
                        autoFocus
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#ffffff",
                            borderRadius: "8px",
                            "& fieldset": {
                              borderColor: "#d1d5db",
                              transition: "border-color 0.2s ease",
                            },
                            "&:hover fieldset": {
                              borderColor: "#3b82f6",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#3b82f6",
                              boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                            },
                          },
                          "& .MuiInputBase-input": {
                            fontSize: "14px",
                            color: "#374151",
                            fontWeight: "500",
                            padding: "10px 12px",
                          },
                          "& .MuiInputBase-input::placeholder": {
                            color: "#9ca3af",
                            opacity: 1,
                            fontWeight: "400",
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mr: 1,
                                color: "#6b7280",
                              }}
                            >
                              <Search size={16} />
                            </Box>
                          ),
                        }}
                      />
                      {regNoSearch && (
                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setRegNoSearch("")}
                            sx={{
                              borderColor: "#d1d5db",
                              color: "#6b7280",
                              fontWeight: "500",
                              textTransform: "none",
                              borderRadius: "6px",
                              padding: "4px 12px",
                              fontSize: "12px",
                              "&:hover": {
                                borderColor: "#9ca3af",
                                backgroundColor: "#f9fafb",
                              },
                            }}
                          >
                            Clear
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Popover>
                </TableCell>

{/* Cumulative Rewards */}
<TableCell
  sx={{
    fontWeight: "600",
    backgroundColor: "#f8fafc",
    padding: "16px 32px",
    fontSize: "14px",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #e2e8f0",
    position: "relative",
  }}
>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center", // Center the text and icon together
      width: "100%",
    }}
  >
    {/* Container for the stacked text */}
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <span style={{ lineHeight: 1.2 }}>Cumulative</span>
      <span style={{ lineHeight: 1.2 }}>Rewards</span>
    </Box>

    {/* Icon is now positioned next to the text */}
    <IconButton
      size="small"
      onClick={handleCumulativeOpen}
      sx={{
        marginLeft: '8px', // Add space between text and icon
        padding: "4px",
        borderRadius: "4px",
        color: "#6b7280",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "#f3f4f6",
          color: "#3b82f6",
        },
      }}
    >
      <FilterListIcon sx={{ fontSize: "18px" }} />
    </IconButton>
  </Box>

  <Popover
    id={
      Boolean(cumulativeAnchorEl)
        ? "cumulative-rewards-popover"
        : undefined
    }
    open={Boolean(cumulativeAnchorEl)}
    anchorEl={cumulativeAnchorEl}
    onClose={handleCumulativeClose}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    PaperProps={{
      sx: {
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        boxShadow:
          "0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.03)",
        minWidth: "300px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      },
    }}
  >
    <Box
      sx={{
        p: 3,
        borderBottom: "1px solid #f1f5f9",
        backgroundColor: "#fafbfc",
      }}
    >
      <Typography
        sx={{
          fontWeight: "600",
          fontSize: "16px",
          color: "#1f2937",
          margin: 0,
          textAlign: "center",
        }}
      >
        Filter Cumulative Rewards
      </Typography>
    </Box>

    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
        }}
      >
        {/* Top-Left */}
        <Select
          size="small"
          value={cumulativePopoverFilter.type}
          onChange={(e) =>
            setCumulativePopoverFilter((prev) => ({
              ...prev,
              type: e.target.value,
            }))
          }
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              "& fieldset": { borderColor: "#d1d5db" },
              "&:hover fieldset": { borderColor: "#3b82f6" },
              "&.Mui-focused fieldset": {
                borderColor: "#3b82f6",
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
              },
            },
            "& .MuiSelect-select": {
              fontWeight: "500",
              color: "#374151",
              fontSize: "14px",
            },
          }}
        >
          <MenuItem value="all" sx={{ fontSize: "14px" }}>
            All
          </MenuItem>
          <MenuItem value="equal" sx={{ fontSize: "14px" }}>
            Equal to
          </MenuItem>
          <MenuItem value="greater" sx={{ fontSize: "14px" }}>
            Greater than
          </MenuItem>
          <MenuItem value="less" sx={{ fontSize: "14px" }}>
            Less than
          </MenuItem>
        </Select>

        {/* Top-Right */}
        <TextField
          size="small"
          type="number"
          placeholder="Enter value"
          value={cumulativePopoverFilter.value}
          onChange={(e) =>
            setCumulativePopoverFilter((prev) => ({
              ...prev,
              value: e.target.value,
            }))
          }
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              "& fieldset": { borderColor: "#d1d5db" },
              "&:hover fieldset": { borderColor: "#3b82f6" },
              "&.Mui-focused fieldset": {
                borderColor: "#3b82f6",
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
              },
            },
            "& .MuiInputBase-input": {
              fontWeight: "500",
              color: "#374151",
              fontSize: "14px",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#9ca3af",
              opacity: 1,
            },
          }}
        />

        {/* Bottom-Left */}
        <Button
          size="small"
          variant="contained"
          onClick={handleCumulativeApply}
          sx={{
            width: "100%",
            backgroundColor: "#3b82f6",
            color: "white",
            fontWeight: "500",
            textTransform: "none",
            borderRadius: "8px",
            padding: "6px 20px",
            fontSize: "14px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "#2563eb",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          Apply
        </Button>

        {/* Bottom-Right */}
        <Button
          size="small"
          variant="outlined"
          onClick={handleCumulativeClear}
          sx={{
            width: "100%",
            borderColor: "#d1d5db",
            color: "#6b7280",
            fontWeight: "500",
            textTransform: "none",
            borderRadius: "8px",
            padding: "6px 20px",
            fontSize: "14px",
            "&:hover": {
              borderColor: "#9ca3af",
              backgroundColor: "#f9fafb",
            },
          }}
        >
          Clear
        </Button>
      </Box>
    </Box>
  </Popover>
</TableCell>

{/* Current Sem Rewards */}
<TableCell
  sx={{
    fontWeight: "600",
    backgroundColor: "#f8fafc",
    padding: "16px 32px",
    fontSize: "14px",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #e2e8f0",
    position: "relative",
  }}
>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center", // Center the text and icon together
      width: "100%",
    }}
  >
    {/* Container for the stacked text */}
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <span style={{ lineHeight: 1.2 }}>Current Sem</span>
      <span style={{ lineHeight: 1.2 }}>Rewards</span>
    </Box>

    {/* Icon is now positioned next to the text */}
    <IconButton
      size="small"
      onClick={handleCurrentSemOpen}
      sx={{
        marginLeft: '8px', // Add space between text and icon
        padding: "4px",
        borderRadius: "4px",
        color: "#6b7280",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "#f3f4f6",
          color: "#3b82f6",
        },
      }}
    >
      <FilterListIcon sx={{ fontSize: "18px" }} />
    </IconButton>
  </Box>

  <Popover
    id={
      Boolean(currentSemAnchorEl)
        ? "current-sem-rewards-popover"
        : undefined
    }
    open={Boolean(currentSemAnchorEl)}
    anchorEl={currentSemAnchorEl}
    onClose={handleCurrentSemClose}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    PaperProps={{
      sx: {
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        boxShadow:
          "0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.03)",
        minWidth: "300px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      },
    }}
  >
    <Box
      sx={{
        p: 3,
        borderBottom: "1px solid #f1f5f9",
        backgroundColor: "#fafbfc",
      }}
    >
      <Typography
        sx={{
          fontWeight: "600",
          fontSize: "16px",
          color: "#1f2937",
          margin: 0,
          textAlign: "center",
        }}
      >
        Filter Current Sem Rewards
      </Typography>
    </Box>

    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
        }}
      >
        {/* Top-Left */}
        <Select
          size="small"
          value={currentSemPopoverFilter.type}
          onChange={(e) =>
            setCurrentSemPopoverFilter((prev) => ({
              ...prev,
              type: e.target.value,
            }))
          }
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              "& fieldset": { borderColor: "#d1d5db" },
              "&:hover fieldset": { borderColor: "#3b82f6" },
              "&.Mui-focused fieldset": {
                borderColor: "#3b82f6",
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
              },
            },
            "& .MuiSelect-select": {
              fontWeight: "500",
              color: "#374151",
              fontSize: "14px",
            },
          }}
        >
          <MenuItem value="all" sx={{ fontSize: "14px" }}>
            All
          </MenuItem>
          <MenuItem value="equal" sx={{ fontSize: "14px" }}>
            Equal to
          </MenuItem>
          <MenuItem value="greater" sx={{ fontSize: "14px" }}>
            Greater than
          </MenuItem>
          <MenuItem value="less" sx={{ fontSize: "14px" }}>
            Less than
          </MenuItem>
        </Select>

        {/* Top-Right */}
        <TextField
          size="small"
          type="number"
          placeholder="Enter value"
          value={currentSemPopoverFilter.value}
          onChange={(e) =>
            setCurrentSemPopoverFilter((prev) => ({
              ...prev,
              value: e.target.value,
            }))
          }
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              "& fieldset": { borderColor: "#d1d5db" },
              "&:hover fieldset": { borderColor: "#3b82f6" },
              "&.Mui-focused fieldset": {
                borderColor: "#3b82f6",
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
              },
            },
            "& .MuiInputBase-input": {
              fontWeight: "500",
              color: "#374151",
              fontSize: "14px",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#9ca3af",
              opacity: 1,
            },
          }}
        />

        {/* Bottom-Left */}
        <Button
          size="small"
          variant="contained"
          onClick={handleCurrentSemApply}
          sx={{
            width: "100%",
            backgroundColor: "#3b82f6",
            color: "white",
            fontWeight: "500",
            textTransform: "none",
            borderRadius: "8px",
            padding: "6px 20px",
            fontSize: "14px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "#2563eb",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          Apply
        </Button>

        {/* Bottom-Right */}
        <Button
          size="small"
          variant="outlined"
          onClick={handleCurrentSemClear}
          sx={{
            width: "100%",
            borderColor: "#d1d5db",
            color: "#6b7280",
            fontWeight: "500",
            textTransform: "none",
            borderRadius: "8px",
            padding: "6px 20px",
            fontSize: "14px",
            "&:hover": {
              borderColor: "#9ca3af",
              backgroundColor: "#f9fafb",
            },
          }}
        >
          Clear
        </Button>
      </Box>
    </Box>
  </Popover>
</TableCell>

{/* Skills Columns Headers */}
{skillColumns.map((skillCol) => (
  <TableCell
    key={skillCol.id}
    sx={{
      fontWeight: "600",
      backgroundColor: "#f8fafc",
      padding: "16px 32px",
      fontSize: "14px",
      color: "#475569",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      borderBottom: "1px solid #e2e8f0",
      position: "relative",
      minWidth: "120px",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span style={{ lineHeight: 1.2 }}>{skillCol.skill}</span>
      </Box>
    </Box>
  </TableCell>
))}
            
            <tbody style={styles.tbody}>
              {sortedStudents.map((student) => (
                <tr
                  key={student.id}
                  style={styles.tr}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f8fafc")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  <td style={styles.td}>{student.totalLevels}</td>
                  <td style={styles.td}>
                    <span style={styles.completedBadge}>
                      {student.completedLevels}/{student.totalLevels}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.nameCell}>
                      <div style={styles.nameMain}>{student.name}</div>
                      <div style={styles.nameSubtle}>
                        {student.department} • {student.year} Year
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>{student.regNo}</td>
                  <td style={{ ...styles.td, ...styles.rewardPoints }}>
                    {student.cumulativeRewards}
                  </td>
                  <td style={{ ...styles.td, ...styles.rewardPoints }}>
                    {student.currentSemRewards}
                  </td>

                  {skillColumns.map((skillCol) => {
                    const skillData =
                      student.skills && student.skills[skillCol.skill];
                    if (!skillData)
                      return (
                        <td
                          key={skillCol.id}
                          style={{ ...styles.td, color: "#9ca3af" }}
                        >
                          -
                        </td>
                      );

                    return (
                      <td key={skillCol.id} style={styles.td}>
                        <div style={styles.skillCell}>
                          <span
                            style={{
                              ...styles.levelBadge,
                              backgroundColor: getLevelBadgeColor(
                                skillData.level
                              ),
                            }}
                          >
                            {skillData.level}/10
                          </span>
                          <span
                            style={{
                              ...styles.daysAgo,
                              color: getDaysColor(skillData.daysAgo),
                            }}
                          >
                            {skillData.daysAgo === 999
                              ? "999d ago"
                              : `${skillData.daysAgo}d ago`}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dash;
