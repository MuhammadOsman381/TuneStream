"use client";
import { useSearchContext } from "@/app/context/SearchContext";
import ArtistProfileCard from "@/components/ArtistProfileCard";
import Drawer from "@/components/Drawer";
import SkeletonLoader from "@/components/SongSkeletonLoader";
import Helpers from "@/config/Helpers";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
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
  const [artistSongs, setArtistSongs] = useState<ArtistSongs[]>([
    defaultArtistSongsValues,
  ]);
  const [dummyartistSongs, setDummyartistSongs] = useState<ArtistSongs[]>([
    defaultArtistSongsValues,
  ]);
  const { isLikedOrDislikeState, setSearch } = useSearchContext();
  const [isLoading, seIsLoading] = useState<Boolean>(true)
  const [drawerValues, setDrawerValues] = useState<Drawer>(drawerDefaultValues);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [currentSong, setCurrentSong] = useState<string>("")
  const [isPlaying, setIsPlaying] = useState<Boolean>(false)
  const [volume, setVolume] = useState<number>(0)

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
    const filtered: ArtistSongs[] = dummyartistSongs?.filter((song) =>
      song.title.toLowerCase().startsWith(search.toLowerCase())
    ) as ArtistSongs[];
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

  const handleLoadedMetadata = () => {
    if (audioPlayer.current) {
      setDuration(audioPlayer.current.duration);
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


  const skipBackward = () => {
    let currentIndex = artistSongs?.findIndex(
      (song) => song?.song === currentSong
    );
    let decrementIndex = currentIndex - 1;
    if (decrementIndex < 0) {
      decrementIndex = artistSongs?.length - 1;
    }
    handlePlayPause(artistSongs[decrementIndex].song);
  };

  const skipForward = () => {
    let currentIndex = artistSongs?.findIndex(
      (song) => song.song === currentSong
    );
    let incrementIndex = currentIndex + 1;
    if (incrementIndex >= artistSongs?.length) {
      incrementIndex = 0;
    }
    handlePlayPause(artistSongs[incrementIndex].song);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioPlayer.current) {
      audioPlayer.current.volume = newVolume;
    }
  };

  function formatTime(seconds: number): string {
    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

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
              <div className="flex flex-row flex-wrap mt-10 items-center justify-between" >
                <SkeletonLoader key={index} />
              </div>
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
                      onClick={() => handlePlayPause(items?.song)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300"
                      aria-label="Play"
                    >
                      <FaPlay className="text-white text-xl" />
                    </button>
                  </div>
                  <div
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                    className="ml-4 flex-1">
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
        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 bg-white text-gray-600 flex items-center justify-between p-4 shadow-lg">
            <div className="flex items-center w-auto">
              <div className="w-12 h-12 mr-4 rounded-xl">
                <img
                  src={
                    artistSongs?.find((song) => song.song === currentSong)
                      ?.thumbnail
                  }
                  alt="current song thumbnail"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="w-auto">
                <h4 className="text-md font-semibold w-auto max-sm:text-sm">
                  {artistSongs?.find((song) => song.song === currentSong)?.title}
                </h4>
                <p className="text-sm text-gray-400">
                  {
                    artistSongs?.find((song) => song.song === currentSong)
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
                <div className="flex flex-row gap-3 items-center justify-center" >
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-[45vw] h-2 bg-gray-300 cursor-pointer rounded-lg appearance-none "
                  style={{
                    background: `linear-gradient(to right, blue 0%, skyblue ${(currentTime / duration) * 100
                      }%, lightgray ${(currentTime / duration) * 100
                      }%, lightgray 100%)`,
                  }}
                />
                <div>
                  {formatTime(currentTime)}
                </div>
              </div>
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
      </div>
      {isDrawerOpen == true && (
        <Drawer isOpen={isDrawerOpen} drawerValues={drawerValues} />
      )}

      <audio
        ref={audioPlayer}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

    </div>
  );
};

export default page;
