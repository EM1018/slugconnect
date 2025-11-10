"use client";
import React, { useState } from "react";

export default function FilterSidebar() {
  // Track selected filter values (can later be passed up to Discover page)
  const [selectedMajor, setSelectedMajor] = useState(""); // default to no major selected
  const [selectedYear, setSelectedYear] = useState(""); // default to no year selected
  // useState allows memorization of state between renders

  // Dummy data for dropdowns (from Supabase later)
  const majors = ["Computer Science", "Biology", "Psychology", "Economics"];
  const years = ["Freshman", "Sophomore", "Junior", "Senior"];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-64">
        {/* shadow-md -> drop shadow, w-64 -> fixed width */}
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
        {/* mb-4 -> margin bottom */}

      {/* Major Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {/* block -> makes label take full width, font-medium -> med weight text */}
          Major
        </label>
        <select
          value={selectedMajor} /* controlled component; value tied to state */
          onChange={(e) => setSelectedMajor(e.target.value)} /* update state on change */
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        > {/* focus:ring-2 focus:ring-blue-500 -> blue outline on focus */}
          <option value="">All Majors</option> {/* default option: no selection, so all shown */}
          {majors.map((major) => (
            <option key={major} value={major}> {/* unique key for each option */}
              {major}
            </option>
          ))}
        </select>
      </div>

      {/* Year Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Year
        </label>
        <select
          value={selectedYear} /* controlled component; value tied to state */
          onChange={(e) => setSelectedYear(e.target.value)} /* update state on change */
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        > {/* focus:ring-2 focus:ring-blue-500 -> blue outline on focus */}
          <option value="">All Years</option> {/* default option: no selection, so all shown */}
          {years.map((year) => (
            <option key={year} value={year}> {/* unique key for each option */}
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          setSelectedMajor(""); {/* reset major filter */}
          setSelectedYear(""); {/* reset year filter */}
        }}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
      > {/* hover:bg-blue-600 -> darker blue on hover */}
        {/* transition -> smooth color change */}
        Reset Filters
      </button>
    </div>
  );
}
