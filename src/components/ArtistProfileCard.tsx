"use client"
import Helpers from "@/config/Helpers";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ArtistProfileCard: React.FC<any> = ({ artistProfile }) => {
  const [isFollowed, setIsFollowed] = useState<Boolean>(false)
  const [refresher, setRefresher] = useState<Boolean>(true)


  const followStatus = () => {
    axios.get(`/api/user/follow-status/${artistProfile.id}`, Helpers.authHeaders)
      .then((response) => {
        setIsFollowed(response.data.followStatus)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const followArtist = () => {
    console.log(artistProfile.id);
    axios.get(`/api/user/follow-artist/${artistProfile.id}`, Helpers.authHeaders)
      .then((response) => {
        setRefresher(!refresher)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    followStatus()
  }, [refresher])

  return (
    <div className="card flex flex-row  items-center justify-center px-10  max-sm:p-4 bg-white text-gray-600 shadow-md">
      <figure className="w-32 h-32 rounded-full overflow-hidden">
        <img
          src={artistProfile.image}
          alt="Profile"
          className="object-cover w-full h-full"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title mb-0 mt-0">{artistProfile.name}</h2>
        <p className="mb-0 mt-0">{artistProfile.email}</p>
        <div className="flex flex-row items-center justify-center gap-3">
          <p className="font-extralight text-[13px]">
            Songs: {artistProfile.songs}
          </p>
          <p className="font-extralight text-[13px]">
            Followers: {artistProfile.followers}
          </p>
        </div>
        <div className="card-actions justify-end">
          <button
            onClick={() => followArtist()}
            className="btn btn-sm  text-white bg-black  hover:scale-110 transition-all">
            {isFollowed ? "Unfollow" : "Follow"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfileCard;
