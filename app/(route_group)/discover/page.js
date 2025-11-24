/**
 *  app/discover/page.js
 *  This file is responsible for displaying what is on the 
 * 'discover' page, likely the main page of our project
 */
"use client";
import React, { use, useState, useEffect } from "react";
import FilterSidebar from "@/components/FilterSideBar";
import ProfileGrid from "@/components/ProfileGrid";
import { supabase } from '@/lib/supabaseClient'
 
export default function DiscoverPage() {
  //TESTING USER INTERESTS
  const userInterestsTest = { Interests: ["Art", "Gaming", "Hiking"] }; // dummy user interests for testing

  // STATE
  const [profiles, setProfiles] = useState([]); // state to hold profiles
  const [userInterests, setUserInterests] = useState([]); // state to hold user interests
  const [loading, setLoading] = useState(true); // state to indicate loading status
  const [error, setError] = useState(null); // state to hold any errors

  // FILTERS
  const [selectedMajor, setSelectedMajor] = useState(""); // state for major filter
  const [selectedYear, setSelectedYear] = useState(""); // state for year filter
  const [selectedInterest, setSelectedInterest] = useState(""); // state for interest filter
  const [selectedInterestCustom, setSelectedInterestCustom] = useState(""); // state for interest filter bubbles
  const [searchQuery, setSearchQuery] = useState(""); // state for search query

  // FETCH DATA FROM SUPABASE
  useState(() => {
    async function loadProfiles() {
      setLoading(true); // set loading to true while fetching data
      const { data, error } = await supabase
        .from('dummy_data') // table name                               Supbase Dummy Data!!!!
        .select('*'); // select all columns

      if (error) {
        console.error("Supabase error:", error);
        setError("Could not load profiles."); // set error state
      } else {
        setProfiles(data || []); // update profiles state with fetched data
      }
      setLoading(false); // set loading to false after fetching data
    }
    
    // Fetch user interests
    async function fetchUserInterests() {
      const { data, error } = await supabase
        .from('dummy_data') // table name for user interests
        .select('*') // select all columns
        .eq('id', '2310a2f3-fa2d-4ba7-88ca-5e47d519b6bc') // REPLACE WITH REAL USER IDENTIFIER
        .single(); // expect a single record
        
      if (error) {
        console.error("Error fetching user interests:", error);
      } else {
        setUserInterests(data.interests || []); // update user interests state
        console.log("Fetched User Interests:", data);
      }
    }

    loadProfiles(); // call the async function to load profiles
    fetchUserInterests(); // call the async function to fetch user interests
  }, []); // empty dependency array ensures this runs once on component mount

  // APPLY FILTERS
  const filteredProfiles = profiles.filter((p) => { // filter profiles based on selected filters and search query
    const matchesMajor = selectedMajor ? p.major === selectedMajor : true; // if a major is selected, check for match
    const matchesYear = selectedYear ? p.year === selectedYear : true; // if a year is selected, check for match
    const matchesInterest = selectedInterest 
      ? Array.isArray(p.interests) && 
      p.interests.some((i) => i.toLowerCase() === selectedInterest.toLowerCase())
      : true; // if an interest is selected, check for match
    const matchesInterestCustom = selectedInterestCustom
      ? Array.isArray(p.interests) && 
      p.interests.some((i) => i.toLowerCase() === selectedInterestCustom.toLowerCase()) // REPLACE
      : true; // if an interest is selected, check for match
    const matchesSearch = searchQuery 
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || // check name
        p.major.toLowerCase().includes(searchQuery.toLowerCase()) // check if name or major includes search query
      : true; // if no search query, always true
    return matchesMajor && matchesYear && matchesInterest 
      && matchesInterestCustom && matchesSearch; // include profile only if all conditions are met
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-1/4 bg-white border-r p-4">
        <FilterSidebar
          /*Major*/
          selectedMajor={selectedMajor} /* pass selected major state */
          setSelectedMajor={setSelectedMajor} /* pass function to update selected major */
          /*Year*/
          selectedYear={selectedYear} /* pass selected year state */
          setSelectedYear={setSelectedYear} /* pass function to update selected year */
          /*Interest*/
          selectedInterest={selectedInterest} /* pass selected interest state */
          setSelectedInterest={setSelectedInterest} /* pass function to update selected interest */
          selectedInterestCustom={selectedInterestCustom} /* pass selected interest state */
          setSelectedInterestCustom={setSelectedInterestCustom} /* pass function to update selected interest */
          userInterests={userInterests} /* pass user interests for custom interest bubbles */
          /*Search*/
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
