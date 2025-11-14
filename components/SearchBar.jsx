"use client"; // need for interactivity
import React from "react";  

export default function SearchBar({ searchQuery, setSearchQuery }) { // values to be passed into search bar
  return (
    <div className="mb-4">
      <input /* std txt box that updates when the user types */
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      /> 
    </div>
  );
}
