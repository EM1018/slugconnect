"use client"; // enables client-side interactivity
import React from "react";

export default function FilterSidebar({ // props for managing filter state
  userInterests,
  selectedMajor,
  setSelectedMajor,
  selectedYear,
  setSelectedYear,
  searchQuery,
  setSearchQuery,
  selectedInterest,
  setSelectedInterest,
}) {
  // dummy data, get from supabase later
  const majors = ["Computer Science", "Biology", "Psychology", "Economics"];
  const years = ["Freshman", "Sophomore", "Junior", "Senior"];
  const interests = ["Art", "Board Games", "Camping", "Cooking", "Dancing", "Fitness",
    "Gaming", "Gardening", "Hiking", "Linguistics", "Movies", "Music", "Photography",
    "Reading", "Sports", "Technology", "Travel", "Writing", "Yoga"
  ];
  console.log("User Interests in FilterSidebar:", userInterests);
  const userDummyInterests = userInterests.length > 0 // check if userInterests has values
    ? userInterests
    : ["Art", "Gaming", "Hiking", "Writing"]; // default interests if none provided (FOR TESTING)!!

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-64">
      {/* Search Bar */}
      <div className="mb-6"> {/* margin bottom for spacing */}
        <input
          type="text"
          placeholder="Search by name or major..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        /> {/* full width, padding, border, rounded corners, focus styles */}
      </div>

      <h2 className="text-xl font-semibold mb-4">Filters</h2>


      {/* Major Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
        <select
          value={selectedMajor}
          onChange={(e) => setSelectedMajor(e.target.value)} /* update selected major on change */
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Majors</option> {/* default option */}
          {majors.map((major) => ( // iterate over majors array
            <option key={major} value={major}> {/* unique key and value for each option */}
              {major} 
            </option> 
          ))}
        </select>
      </div>

      {/* Year Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)} /* update selected year on change */
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Years</option> {/* default option */}
          {years.map((year) => (  // iterate over years array
            <option key={year} value={year}> {/* unique key and value for each option */}
              {year} 
            </option>
          ))}
        </select>
      </div>

      {/* Interest Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Interest</label>
        <select
          value={selectedInterest}
          onChange={(e) => setSelectedInterest(e.target.value)} /* update selected interest on change */
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Interests</option> {/* default option */}
          {interests.map((interest) => (  // iterate over interests array
            <option key={interest} value={interest}> {/* unique key and value for each option */}
              {interest} 
            </option>
          ))}
        </select>
      </div>

      {/* Filter Bubbles */}
      <div className="mt-4 mb-6">
        <h3 className="font-semibold mb-2">Filter by interests</h3>

        <div className="flex flex-wrap gap-2"> {/* flex container with wrapping and gap */}
          {userDummyInterests.map((interest) => { 
            const isSelected =
              selectedInterest.toLowerCase() === interest.toLowerCase(); // check if this interest is selected (case insensitive)
            return (
              <button
                key={interest} 
                onClick={() => 
                  setSelectedInterest( 
                    isSelected ? "" : interest // toggle off if clicked again
                  )
                }
                // px-3 py-1 for padding, rounded-full for pill shape
                // transition for smooth hover effect (bg-gray-100)
                className={`px-3 py-1 rounded-full border text-sm transition 
                  ${isSelected ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
              >  
                {interest}
              </button>
            );
          })} {/* end of interests map */}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => { // reset all filters
          setSelectedMajor(""); 
          setSelectedYear("");
          setSelectedInterest("");
          setSearchQuery("");
        }}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
      >
        Reset Filters
      </button>
    </div>
  );
}
