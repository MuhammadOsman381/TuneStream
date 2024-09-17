"use client";
import EditSong from "@/components/EditSong";
import ProfileCard from "@/components/ProfileCard";
import Helpers from "@/config/Helpers";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import {
  FaPlay,
  FaEdit,
  FaTrash,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import SkeletonLoader from "@/components/SongSkeletonLoader";
import { useSearchContext } from "@/app/context/SearchContext";

interface SongArray {
  _id: string;
  title: string;
  thumbnail: string;
  song: string;
  comments: string[];
  likes: string[];
  dislikes: string[];
  artist: string;
  artistName: string;
  createdAt: Date;
}

interface Song {
  _id: string;
  title: string;
  thumbnail: File | string | null;
  song: File | string | null;
}

const Page = () => {
  const defaultEditValues: Song = {
    _id: "",
    title: "",
    thumbnail: null,
    song: null,
  };
  const { search, setSearch } = useSearchContext();
  const [songsArray, setSongsArray] = useState<SongArray[] | null>([]);
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [refresher, setRefresher] = useState<boolean>(false);
  const [filteredSongs, setFilteredSongs] = useState<SongArray[] | null>([]);
  const [isEditEnabled, setIsEditEnabled] = useState<boolean>(false);
  const [editSongObject, setEditSongObject] = useState<Song>(defaultEditValues);
  const [loading, setLoading] = useState<boolean>(true);
  const audioPlayer = useRef<HTMLAudioElement>(null);

  const getArtistSongs = () => {
    axios
      .get("/api/song/get-artist-songs", Helpers.authHeaders)
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
    setLoading(true);
    getArtistSongs();
  }, [refresher]);

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
    if (audioPlayer.current) {
      audioPlayer.current.currentTime = Math.max(0, currentTime - 10);
    }
  };

  const skipForward = () => {
    if (audioPlayer.current) {
      audioPlayer.current.currentTime = Math.min(duration, currentTime + 10);
    }
  };

  const deleteSong = (songID: string) => {
    axios
      .delete(`/api/song/delete/${songID}`, Helpers.authHeaders)
      .then((response) => {
        toast.success(response.data.message);
        setRefresher(!refresher);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editSong = (
    _id: string,
    title: string,
    thumbnail: string,
    song: string
  ) => {
    setEditSongObject({
      _id: _id,
      title: title,
      thumbnail: thumbnail,
      song: song,
    });
    setIsEditEnabled(true);
  };

  useEffect(() => {
    const filtered: SongArray[] | null = songsArray?.filter((song) =>
      song.title.toLowerCase().startsWith(search.toLowerCase())
    ) as SongArray[] | null;
    setFilteredSongs(filtered);
  }, [search]);

  return (
    <>
      {!isEditEnabled && (
        <div className="flex items-center flex-col justify-center w-full ">
          <div className="mt-5">
            {loading ? <SkeletonLoader /> : <ProfileCard />}
          </div>
          <div className="p-5 flex flex-row items-center justify-center flex-wrap gap-5">
            {loading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <SkeletonLoader key={index} />
                ))
              : filteredSongs?.length !== 0 &&
                filteredSongs?.map((items: SongArray) => (
                  <div
                    key={items._id}
                    className="card max-w-sm bg-white text-gray-600 rounded-lg shadow-md p-4 transform transition duration-500 hover:scale-105 hover:shadow-lg w-[40vw] max-sm:w-[41vh]"
                  >
                    <div className="relative flex items-center">
                      <div className="relative w-24 h-24 rounded-md overflow-hidden">
                        <img
                          src={items.thumbnail}
                          alt={items.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handlePlayPause(items.song)}
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
                            <span className="flex flex-row gap-1 items-start justify-center">
                              <span>{items.likes.length}</span>
                              <FaThumbsUp className="text-blue-500 text-lg" />
                            </span>
                            <span className="flex flex-row gap-1 items-end justify-center">
                              <span>{items.dislikes.length}</span>
                              <FaThumbsDown className="text-red-500 text-lg" />
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(items?.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex flex-row items-center justify-end">
                      <button
                        onClick={() =>
                          editSong(
                            items?._id,
                            items?.title,
                            items?.thumbnail,
                            items?.song
                          )
                        }
                        className="mr-4 cursor-pointer"
                      >
                        <FaEdit className="text-blue-500 text-lg hover:scale-125 transition-all" />
                      </button>
                      <button onClick={() => deleteSong(items._id)}>
                        <FaTrash className="text-red-500 text-lg cursor-pointer hover:scale-125 transition-all" />
                      </button>
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
                    {
                      songsArray?.find((song) => song.song === currentSong)
                        ?.title
                    }
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
      )}

      {isEditEnabled && <EditSong songValues={editSongObject} />}
    </>
  );
};

export default Page;
