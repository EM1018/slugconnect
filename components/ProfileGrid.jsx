"use client"; // 
import React from "react";
import ProfileCard from "./ProfileCard";

// labels fn as default export (allows import _ from _)
export default function ProfileGrid({ profiles }) { // profiles is an array of profile objects
  if (!profiles || profiles.length === 0) { // if no profiles available
    return (
        // flex justify-center items-center -> centers message both vertically and horizontally
        // h-64 -> fixed height for the container
        // bg-white rounded-2xl shadow-sm -> styling for the container
        // text-gray-500 -> text color
      <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-sm text-gray-500">
        Looks a little empty here... Try adjusting your filters or search criteria!
      </div>
    );
  }

  return (
    // grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 -> responsive grid layout
    // gap-6 -> spacing between grid items
    // p-6 -> padding around the grid
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {/*missing value handling*/}
      {profiles.map((profile) => { // iterate over profiles array; renders one dive per profile
        const missingName = profile?.name ?? "Unknown Student"; // default name if missing
        const missingMajor = profile?.major ?? "Undeclared"; // default major if missing PROBABLY CHANGE LATER
        // const missingCollege = profile?.college ?? "Unknown College"; // default college if missing
        // const missingYear = profile?.year ?? "Unknown Year"; // default year if missing
        // const missingInterests = profile?.interests ?? ["No interests listed"]; // default interests if missing
        const safeStatus = profile?.status ?? ""; // default status if missing

        return (
          <ProfileCard
            key={profile.id} // unique key for each profile card
            id={profile.id} // pass user ID for connection requests
            name={missingName} // pass name prop
            major={missingMajor} // pass major prop
            year={profile?.year} // pass year prop
            college={profile?.college} // pass college prop
            interests={profile?.interests} // pass interests prop
            status={safeStatus} // pass status prop
          />
        );
      })}
    </div>
  );
}
