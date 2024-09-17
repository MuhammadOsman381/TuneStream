"use client";
import Helpers from "@/config/Helpers";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import SkeletonLoader from "@/components/SongSkeletonLoader";
import { useSearchContext } from "@/app/context/SearchContext";
import Drawer from "@/components/Drawer";
import { FaPlus } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import Link from "next/link";

interface SongArray {
  _id: string;
  title: string;
  thumbnail: string;
  song: string;
  comments: string[];
  likes: string[];
  dislikes: string[];
  artistId: string;
  artistName: string;
  createdAt: Date;
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

const Page = () => {
  const drawerDefaultValues: Drawer = {
    _id: "",
    title: "",
    thumbnail: "",
    artistName: "",
    likes: [""],
    dislikes: [""],
    createdAt: new Date(),
  };

  const { search, setSearch, isLikedOrDislikeState, setIsLikedOrDislikeState } =
    useSearchContext();

  const [songsArray, setSongsArray] = useState<SongArray[]>([]);
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [filteredSongs, setFilteredSongs] = useState<SongArray[] | null>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [drawerValues, setDrawerValues] = useState<Drawer>(drawerDefaultValues);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const audioPlayer = useRef<HTMLAudioElement>(null);

  const getArtistSongs = () => {
    axios
      .get("/api/song/getUsersSongs", Helpers.authHeaders)
      .then((response) => {
        setSongsArray(response?.data?.songs);
        setFilteredSongs(response?.data?.songs);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getArtistSongs();
  }, [isLikedOrDislikeState]);

  const handlePlayPause = (songUrl: string) => {
    if (currentSong === songUrl) {
      if (isPlaying) {
        audioPlayer.current?.pause();
      } else {
        audioPlayer.current?.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(songUrl);
      setIsPlaying(true);
      if (audioPlayer.current) {
        audioPlayer.current.src = songUrl;
        audioPlayer.current.play();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioPlayer.current) {
      setCurrentTime(audioPlayer.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioPlayer.current) {
      audioPlayer.current.currentTime = parseFloat(e.target.value);
      setCurrentTime(parseFloat(e.target.value));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioPlayer.current) {
      audioPlayer.current.volume = newVolume;
    }
  };

  const handleLoadedMetadata = () => {
    if (audioPlayer.current) {
      setDuration(audioPlayer.current.duration);
    }
  };

  const skipBackward = () => {
    let currentIndex = songsArray.findIndex(
      (song) => song.song === currentSong
    );
    let decrementIndex = currentIndex - 1;
    if (decrementIndex < 0) {
      decrementIndex = songsArray.length - 1;
    }
    handlePlayPause(songsArray[decrementIndex].song);
  };

  const skipForward = () => {
    let currentIndex = songsArray.findIndex(
      (song) => song.song === currentSong
    );
    let incrementIndex = currentIndex + 1;
    if (incrementIndex >= songsArray.length) {
      incrementIndex = 0;
    }
    handlePlayPause(songsArray[incrementIndex].song);
  };

  useEffect(() => {
    const filtered: SongArray[] | null = songsArray?.filter((song) =>
      song.title.toLowerCase().startsWith(search.toLowerCase())
    ) as SongArray[] | null;
    setFilteredSongs(filtered);
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

  const addValueToLocalStorage = (id:string) =>{
    localStorage.setItem("artistId",id);
  }

  function initCap(str: string): string {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  return (
    <>
      <div className="flex items-center flex-col justify-center w-full ">
        <div className="p-5 flex flex-row items-center justify-center flex-wrap gap-5">
          {loading
            ? Array.from({ length: 10 }).map((_, index) => (
                <SkeletonLoader key={index} />
              ))
            : filteredSongs?.length !== 0 &&
              filteredSongs?.map((items: SongArray) => (
                <div
                  key={items._id}
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
                  className="card  max-w-sm cursor-pointer bg-white text-gray-600 rounded-lg shadow-md p-4 transform transition duration-500 hover:scale-105 hover:shadow-lg w-[40vw] max-sm:w-[41vh]"
                >
                  <div className="relative  flex items-center">
                    <div className="relative w-24 h-24 rounded-xl ">
                      <img
                        src={items.thumbnail}
                        alt={items.title}
                        className="w-full h-full rounded-xl object-cover"
                      />
                      <button
                        onClick={() => handlePlayPause(items.song)}
                        className="absolute inset-0 rounded-xl flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300"
                        aria-label="Play"
                      >
                        <FaPlay className="text-white text-xl" />
                      </button>
                    </div>
                    <div className="ml-4 flex-1  ">
                      <div onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
                        <h3 className="text-lg font-semibold ">
                          {initCap(items.title)}
                        </h3>
                      </div>
                      <p
                        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                        className="text-gray-400"
                      >
                        {initCap(items.artistName)}
                      </p>
                      <div className="mr-4 flex flex-col items-start justify-start">
                        <div className="flex items-center gap-3">
                          <span
                            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                            className="flex flex-row text-blue-500 gap-1 items-start justify-center"
                          >
                            <span className="font-semibold text-md">
                              {"Likes"}
                            </span>
                            <span>{items.likes.length}</span>
                          </span>
                          <span
                            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                            className="flex flex-row text-red-500 gap-1 items-end justify-center"
                          >
                            <span className="font-semibold text-md">
                              {"Dislikes"}
                            </span>
                            <span>{items.dislikes.length}</span>
                          </span>
                          <div
                            onClick={() => setIsDrawerOpen(false)}
                            className="dropdown  dropdown-bottom dropdown-left"
                          >
                            <div
                              onClick={() => setIsDrawerOpen(false)}
                              tabIndex={0}
                              role="button"
                              className="btn btn-sm ml-2 z-50 hover:bg-gray-200 shadow-none bg-gray-100 border-none text-gray-500 text-xl"
                            >
                              <BsThreeDots />
                            </div>
                            <ul
                              tabIndex={0}
                              className="dropdown-content menu bg-white  rounded-box z-20 w-52 p-2 "
                            >
                              <li onClick={() => setIsDrawerOpen(false)}>
                                <a>
                                  <FaPlus /> Add to Playlist
                                </a>
                              </li>
                              <li onClick={() => setIsDrawerOpen(false)}>
                                <Link
                                onClick={()=>addValueToLocalStorage(items?.artistId)}
                                href={"/user/artist-profile"} >
                                  <FaRegUser /> Go to Profile{" "}
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(items?.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 bg-white text-gray-600 flex items-center justify-between p-4 shadow-lg">
            <div className="flex items-center w-auto">
              <div className="w-12 h-12 mr-4 rounded-xl">
                <img
                  src={
                    songsArray?.find((song) => song.song === currentSong)
                      ?.thumbnail
                  }
                  alt="current song thumbnail"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="w-auto">
                <h4 className="text-md font-semibold w-auto max-sm:text-sm">
                  {songsArray?.find((song) => song.song === currentSong)?.title}
                </h4>
                <p className="text-sm text-gray-400">
                  {
                    songsArray?.find((song) => song.song === currentSong)
                      ?.artistName
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex flex-col w-[70vw] items-center justify-center">
                <div className="flex items-center">
                  <button
                    onClick={skipBackward}
                    className="mx-2 hover:scale-125 transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handlePlayPause(currentSong!)}
                    className="mx-2 hover:scale-125 transition-all"
                  >
                    {isPlaying ? (
                      <div className="text-2xl">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 9v6m4-6v6"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-5.197-3.073A1 1 0 008 9v6a1 1 0 001.555.832l5.197-3.073a1 1 0 000-1.664z"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                  <button
                    onClick={skipForward}
                    className="mx-2 hover:scale-125 transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 19l7-7m0 0l-7-7m7 7H3"
                      />
                    </svg>
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-[45vw] h-2 bg-gray-300 cursor-pointer rounded-lg appearance-none hover:scale-105 transition-all"
                  style={{
                    background: `linear-gradient(to right, blue 0%, skyblue ${
                      (currentTime / duration) * 100
                    }%, lightgray ${
                      (currentTime / duration) * 100
                    }%, lightgray 100%)`,
                  }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-2 bg-gray-300 cursor-pointer rounded-lg appearance-none hover:scale-125 transition-all"
              />
            </div>
          </div>
        )}

        <audio
          ref={audioPlayer}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>

      {isDrawerOpen == true && (
        <Drawer isOpen={isDrawerOpen} drawerValues={drawerValues} />
      )}
    </>
  );
};

export default Page;
