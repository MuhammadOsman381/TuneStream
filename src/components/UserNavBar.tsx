"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Helpers from "@/config/Helpers";
import axios from "axios";
import { useSearchContext } from "@/app/context/SearchContext";

interface UserProfile {
  _id: string;
  name: string;
  image: string;
  email: string;
  songs: string[];
  followers: string[];
}

const UserNavBar = () => {
  const { search, setSearch } = useSearchContext();
  const router = useRouter();

  function initCap(str: string): string {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const logout_user = () => {
    toast.success("User logged out successfully!");
    localStorage.clear();
    router.push("/");
  };

  const defaultUserData = {
    _id: "",
    name: "",
    email: "",
    image: "",
    songs: [],
    followers: [],
  };

  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserData);
  const userData = () => {
    axios
      .get("/api/user/profile", Helpers.authFileHeaders)
      .then((response) => {
        setUserProfile(response.data.userProfile);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    userData();
  }, []);

  return (
    <div>
      <div className="navbar bg-white text-gray-600">
        <div className="flex-1">
          <button className="btn btn-ghost text-xl">Tune Stream</button>
        </div>

        {/* Search Bar */}
        <div className="flex bg-gray-200  rounded-lg text-gray-600 md:flex">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for songs"
            className="input input-bordered rounded-lg text-gray-600 bg-gray-200 w-full max-sm:w-[33vw]"
          />
        </div>

        <div className="dropdown flex flex-row-reverse mr-1 dropdown-end ml-3">
          {userProfile.name !== "" && (
            <h1 className="font-semibold">{initCap(userProfile.name)}</h1>
          )}
          {userProfile.image !== "" && (
            <div tabIndex={0} className="btn btn-ghost   btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt="Profile avatar" src={userProfile.image} />
              </div>
            </div>
          )}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white text-gray-500 rounded-box z-[1] mt-20 w-52 p-2 shadow"
          >
            <li className="justify-between">
              <Link href="/user/home">Home</Link>
            </li>
            <li>
              <Link href="/user/user-profile">Profile</Link>
            </li>
            <li>
              <Link href="/user/followed-artists">Followed Artists</Link>
            </li>
            <li
              className="btn btn-primary btn-sm text-white"
              onClick={logout_user}
            >
              Logout
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserNavBar;
