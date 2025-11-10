"use client"; // 
import React from "react";

// labels fn as default export (allows import _ from _)
export default function ProfileGrid({ profiles }) { // profiles is an array of profile objects
  if (!profiles || profiles.length === 0) { // if no profiles available
    return (
        // flex justify-center items-center -> centers message both vertically and horizontally
        // h-64 -> fixed height for the container
        // bg-white rounded-2xl shadow-sm -> styling for the container
        // text-gray-500 -> text color
      <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-sm text-gray-500">
        No other students yet. Be the first to create a profile!
      </div>
    );
  }

  return (
    // gird -> enables grid layout
    // grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 -> responsive column layout
    // (i.e., 1 column on small screens, 2 on small-medium, 3 on medium-large, 4 on large screens)
    // gap-6 -> spacing between grid items
    // p-4 -> padding around the grid
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {profiles.map((profile) => ( // iterate over profiles array; renders one dive per profile
        <div
          key={profile.id} // unique key for each profile card (helps react identify elements)
          className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center"
          // bg-white rounded-xl shadow-md p-6 -> styling for each profile card
          // flex flex-col items-center justify-center -> centers content vertically and horizontally in a column layout
        >
          {/* Placeholder for ProfileCard (<ProfileCard profile={profile}>)*/}
          <div className="h-24 w-24 bg-gray-200 rounded-full mb-4" />
          {/* simulates a grey circle for profile photo */}
          <h2 className="text-lg font-semibold">{profile.name}</h2>
          <p className="text-gray-500">{profile.major}</p>
        </div>
      ))}
    </div>
  );
}
