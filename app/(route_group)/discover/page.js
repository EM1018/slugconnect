/**
 *  app/discover/page.js
 *  This file is responsible for displaying what is on the 
 * 'discover' page, likely the main page of our project
 */
"use client";
import React, { use, useState } from "react";
import FilterSidebar from "@/components/FilterSideBar";
import ProfileGrid from "@/components/ProfileGrid";
import { supabase } from '@/lib/supabaseClient'
 
export default function DiscoverPage() {
      // supabase dummy data
  // STATE
  const [profiles, setProfiles] = useState([]); // state to hold profiles
  const [loading, setLoading] = useState(true); // state to indicate loading status
  const [error, setError] = useState(null); // state to hold any errors

  // FILTERS
  const [selectedMajor, setSelectedMajor] = useState(""); // state for major filter
  const [selectedYear, setSelectedYear] = useState(""); // state for year filter
  const [searchQuery, setSearchQuery] = useState(""); // state for search query

  // FETCH DATA FROM SUPABASE
  useState(() => {
    async function loadProfiles() {
      setLoading(true); // set loading to true while fetching data
      const { data, error } = await supabase
        .from('dummy_data') // table name
        .select('*'); // select all columns

      if (error) {
        console.error("Supabase error:", error);
        setError("Could not load profiles."); // set error state
      } else {
        setProfiles(data || []); // update profiles state with fetched data
      }
      setLoading(false); // set loading to false after fetching data
    }

    loadProfiles(); // call the async function to load profiles
  }, []); // empty dependency array ensures this runs once on component mount

  // APPLY FILTERS
  const filteredProfiles = profiles.filter((p) => { // filter profiles based on selected filters and search query
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

      <div className="flex-1 p-4">
        {/* Loading UI */}
        {loading && (
          <div className="text-center text-gray-500 mt-8">Loading profiles...</div>
        )}

        {/* Error UI */}
        {!loading && error && (
          <div className="text-center text-red-500 mt-8">{error}</div>
        )}

        {/* Only show grid when not loading and no error */}
        {!loading && !error && (
          <ProfileGrid profiles={filteredProfiles} />
        )}
      </div>
    </div>
  );
}
