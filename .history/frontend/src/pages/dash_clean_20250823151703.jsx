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
