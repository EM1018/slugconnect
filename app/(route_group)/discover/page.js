/**
 *  app/discover/page.js
 *  This file is responsible for displaying what is on the 
 * 'discover' page, likely the main page of our project
 */
"use client";
import React, { useState } from "react";
import FilterSidebar from "@/components/FilterSideBar";
import ProfileGrid from "@/components/ProfileGrid";
import { supabase } from '@/lib/supabaseClient'
 
export default function DiscoverPage() {
      // dummy data, replace with supabase fetch later
  const allProfiles = [
    { id: 1, name: "Alice Kim", major: "Computer Science", year: "Sophomore" },
    { id: 2, name: "Brian Lee", major: "Biology", year: "Junior" },
    { id: 3, name: "Chloe Tran", major: "Psychology", year: "Freshman" },
    { id: 4, name: "David Nguyen", major: "Computer Science", year: "Senior" },
  ];

  const [selectedMajor, setSelectedMajor] = useState(""); // state for major filter
  const [selectedYear, setSelectedYear] = useState(""); // state for year filter
  const [searchQuery, setSearchQuery] = useState(""); // state for search query

  const filteredProfiles = allProfiles.filter((p) => { // filter profiles based on selected filters and search query
    const matchesMajor = selectedMajor ? p.major === selectedMajor : true; // if a major is selected, check for match
    const matchesYear = selectedYear ? p.year === selectedYear : true; // if a year is selected, check for match
    const matchesSearch = searchQuery 
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || // check name
        p.major.toLowerCase().includes(searchQuery.toLowerCase()) // check if name or major includes search query
      : true; // if no search query, always true
    return matchesMajor && matchesYear && matchesSearch; // include profile only if all conditions are met
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-1/4 bg-white border-r p-4">
        <FilterSidebar
          selectedMajor={selectedMajor} /* pass selected major state */
          setSelectedMajor={setSelectedMajor} /* pass function to update selected major */
          selectedYear={selectedYear} /* pass selected year state */
          setSelectedYear={setSelectedYear} /* pass function to update selected year */
          searchQuery={searchQuery} /* pass search query state */
          setSearchQuery={setSearchQuery} /* pass function to update search query */
        />
      </div>

      <div className="flex-1 p-6">
        <ProfileGrid profiles={filteredProfiles} /> {/* pass filtered profiles to ProfileGrid */}
      </div>
    </div>
  );
}
