"use client";
import Helpers from "@/config/Helpers";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface UserProfile {
  _id: string;
  name: string;
  image: string;
  email: string;
  songs: string[];
  followers: string[];
}

const ProfileCard = () => {
  const defaultUserData: UserProfile = {
    _id: "",
    name: "",
    email: "",
    image: "",
    songs: [],
    followers: [],
  };

  const [userProfile, setUserProfile] = useState(defaultUserData);
  const userData = () => {
    axios
      .get("/api/artist/profile", Helpers.authFileHeaders)
      .then((response) => {
        setUserProfile(response.data.artistProfile);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    userData();
  }, []);

  return (
    <div className="card flex flex-row mt-4 items-center justify-center px-10  max-sm:p-4 bg-white text-gray-600 shadow-md">
      <figure className="w-32 h-32 rounded-full overflow-hidden">
        <img
          src={userProfile.image}
          alt="Profile"
          className="object-cover w-full h-full"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title mb-0 mt-0">{userProfile.name}</h2>
        <p className="mb-0 mt-0">{userProfile.email}</p>
        <div className="flex flex-row items-center justify-center gap-3">
          <p className="font-extralight text-[13px]">
            Songs: {userProfile.songs.length}
          </p>
          <p className="font-extralight text-[13px]">
            Followers: {userProfile.followers.length}
          </p>
        </div>
        <div className="card-actions justify-end">
          <button className="btn btn-sm btn-primary text-white bg-blue-500 hover:bg-blue-700 hover:scale-110 transition-all">
            Edit
          </button>
          <button className="btn btn-sm flex items-center justify-center btn-error hover:scale-110 transition-all text-white">
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
