"use client";
import { useSearchContext } from "@/app/context/SearchContext";
import ArtistProfileCard from "@/components/ArtistProfileCard";
import Drawer from "@/components/Drawer";
import SkeletonLoader from "@/components/SongSkeletonLoader";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaPlay, FaThumbsDown, FaThumbsUp } from "react-icons/fa";

interface ArtistProfile {
  id: string;
  name: string;
  email: string;
  image: string;
  songs: number,
  followers: number,
}

interface ArtistSongs {
  _id: string;
  title: string;
  thumbnail: string;
  song: string;
  comments: string[];
  likes: string[];
  dislikes: string[];
  artist: string;
  artistName: string;
  createdAt: Date
}

interface Drawer {
  _id: string;
  title: string;
  thumbnail: string;
  artistName: string;
  likes: string[];
  dislikes: string[];
  createdAt: Date;
}

const page = (req: any) => {
  const { search } = useSearchContext();
  const defaultArtistProfileValues: ArtistProfile = {
    id: "",
    name: "",
    email: "",
    image: "",
    songs: 0,
    followers: 0,
  };
  const defaultArtistSongsValues: ArtistSongs = {
    _id: "",
    title: "",
    thumbnail: "",
    song: "",
    comments: [""],
    likes: [""],
    dislikes: [""],
    artist: "",
    artistName: "",
    createdAt: new Date(),
  };

  const drawerDefaultValues: Drawer = {
    _id: "",
    title: "",
    thumbnail: "",
    artistName: "",
    likes: [""],
    dislikes: [""],
    createdAt: new Date(),
  };

  const [artistProfile, setArtistProfile] = useState<ArtistProfile>(
    defaultArtistProfileValues
  );
  const [artistSongs, setArtistSongs] = useState<ArtistSongs[] | null>([
    defaultArtistSongsValues,
  ]);
  const [dummyartistSongs, setDummyartistSongs] = useState<ArtistSongs[]>([
    defaultArtistSongsValues,
  ]);
  const { isLikedOrDislikeState, setSearch } = useSearchContext();
  const [isLoading, seIsLoading] = useState<Boolean>(true)
  const [drawerValues, setDrawerValues] = useState<Drawer>(drawerDefaultValues);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);


  const getArtistData = () => {
    axios
      .get(`/api/artist/gotoProfile/${req?.params.artistID}`)
      .then((response) => {
        setArtistSongs(response.data.artistProfile.artistSong);
        setDummyartistSongs(response.data.artistProfile.artistSong)
        setArtistProfile(response.data.artistProfile.artistProfile);
        seIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  useEffect(() => {
    const filtered: ArtistSongs[] | null = dummyartistSongs?.filter((song) =>
      song.title.toLowerCase().startsWith(search.toLowerCase())
    ) as ArtistSongs[] | null;
    setArtistSongs(filtered);
  }, [search]);


  const openDrawer = (
    _id: string,
    title: string,
    thumbnail: string,
    artistName: string,
    likes: string[],
    dislikes: string[],
    createdAt: Date
  ) => {
    setIsDrawerOpen(!isDrawerOpen);
    setDrawerValues({
      _id: _id.toString(),
      title: title,
      thumbnail: thumbnail,
      artistName: artistName,
      likes: likes,
      dislikes: dislikes,
      createdAt: createdAt,
    });
  };

  useEffect(() => {
    getArtistData();
  }, [isLikedOrDislikeState]);

  return (
    <div className="flex items-center flex-col justify-center w-full p-5" >
      {
        isLoading ?
          <SkeletonLoader /> : <ArtistProfileCard artistProfile={artistProfile} />
      }

      <div className="flex flex-row flex-wrap items-center justify-center p-2 gap-5" >
        {
          isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
              <SkeletonLoader key={index} />
            )) :
            artistSongs?.length !== 0 &&
            artistSongs?.map((items: ArtistSongs) => (
              <div
                key={items?._id}
                onClick={() =>
                  openDrawer(
                    items._id,
                    items.title,
                    items.thumbnail,
                    items.artistName,
                    items.likes,
                    items.dislikes,
                    items.createdAt
                  )
                }
                className="card max-w-sm cursor-pointer bg-white text-gray-600 rounded-lg shadow-md p-4 transform transition duration-500 hover:scale-105 hover:shadow-lg w-[40vw] max-sm:w-[41vh]"
              >
                <div className="relative flex items-center">
                  <div className="relative w-24 h-24 rounded-md overflow-hidden">
                    <img
                      src={items.thumbnail}
                      alt={items.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      // onClick={() => handlePlayPause(items.song)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300"
                      aria-label="Play"
                    >
                      <FaPlay className="text-white text-xl" />
                    </button>
                  </div>
                  <div className="ml-4 flex-1">
                    <div>
                      <h3 className="text-lg font-semibold ">
                        {items.title}
                      </h3>
                    </div>
                    <p className="text-gray-400">{items.artistName}</p>
                    <div className="mr-4 flex flex-col items-start justify-start">
                      <div className="flex items-center gap-3">
                        <span className="flex flex-row gap-1 items-start text-blue-500 justify-center">
                          <span>Likes: {items.likes.length}</span>
                        </span>
                        <span className="flex flex-row gap-1 items-end text-red-500 justify-center">
                          <span>Dislikes: {items.dislikes.length}</span>
                        </span>
                      </div>
                      <span className="text-sm  text-gray-500">
                        {new Date(items?.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
      </div>
      {isDrawerOpen == true && (
        <Drawer isOpen={isDrawerOpen} drawerValues={drawerValues} />
      )}

    </div>
  );
};

export default page;
