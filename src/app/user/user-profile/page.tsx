"use client";
import { useSearchContext } from "@/app/context/SearchContext";
import UserProfileCard from "@/components/UserProfileCard";
import Helpers from "@/config/Helpers";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { RiPlayList2Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { FaPlay, FaTrashAlt } from "react-icons/fa";
import DotLoader from "@/components/DotLoader";

interface UserProfile {
  _id: string;
  name: string;
  image: string;
  email: string;
  songs: string[];
  followers: string[];
}

interface Playlist {
  playlistTitle: string
  playlistID: string;
  _id: string,
  title: string,
  thumbnail: string,
  song: string,
  likes: string[],
  dislikes: string[],
  artistId: string[],
  artistName: string,
  comments: string[],
  createdAt: Date,
  updatedAt: Date,
}

const page = () => {
  const defaultUserData = {
    _id: "",
    name: "",
    email: "",
    image: "",
    songs: [],
    followers: [],
  };

  const { search, setSearch } = useSearchContext();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserData);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist[]>([]);
  const [dummyPlayListData, setDummyPlayListData] = useState<Playlist[] | null>([]);
  const [showList, setShowList] = useState<Boolean>(false);
  const [newPlaylistName, setNewPlaylistName] = useState<string>("");
  const [refresher, setRefresher] = useState<Boolean>(false);
  const [playListTitle, setPlayListTitle] = useState<string>("");
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [currentSong, setCurrentSong] = useState<string>("")
  const [isPlaying, setIsPlaying] = useState<Boolean>(false)
  const [volume, setVolume] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<Boolean>(true)

  function initCap(str: string | null) {
    if (str !== (null || "")) {
      return str
        ?.split(" ")
        ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        ?.join(" ")
    }
  }

  const userData = () => {
    axios
      .get("/api/user/profile", Helpers.authFileHeaders)
      .then((response) => {
        console.log(response.data);
        setUserProfile(response.data.userProfile);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    userData();
  }, []);

  const handleCreatePlaylist = () => {
    const formData = new FormData();
    if (newPlaylistName) {
      formData.append("title", newPlaylistName);
      axios
        .post("/api/playlist/create", formData, Helpers.authFileHeaders)
        .then((response) => {
          console.log(response.data);
          setRefresher(!refresher)
        })
        .catch((error) => {
          console.log(error);
        });
      const dialog = document.getElementById("my_modal_1") as HTMLDialogElement;
      dialog?.close();
      setNewPlaylistName("");
    }
  };

  const handlePlaylistClick = (playlistID: string, title: string) => {
    setPlayListTitle(title)
    setCurrentSong("");
    axios.get(`/api/playlist/getSongs/${playlistID}`, Helpers.authHeaders)
      .then((response) => {
        setSelectedPlaylist(response.data.songs);
        setDummyPlayListData(response.data.songs)
        setShowList(true)
      })
      .catch((error) => {
        setShowList(true)
        console.log(error);
        setSelectedPlaylist([])
        setDummyPlayListData([])
      });
  };

  const getPlayListData = () => {
    axios
      .get("/api/playlist/get", Helpers.authHeaders)
      .then((response) => {
        console.log(response.data.userPlayLists);
        setPlaylists(response.data.userPlayLists);
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(error);

      });
  };

  const openModal = () => {
    const dialog = document.getElementById("my_modal_1") as HTMLDialogElement;
    dialog?.showModal();
  };


  const removeSongFromList = (songID: string, playlistID: string) => {
    axios.post(`/api/playlist/removeSong`, {
      songID,
      playlistID
    })
      .then(async (response) => {
        const filteredSongs = selectedPlaylist.filter((id) => id._id.toString() !== songID.toString())
        setSelectedPlaylist(filteredSongs)
        setDummyPlayListData(filteredSongs)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const deletePlaylist = (playListID: string) => {
    axios.delete(`/api/playlist/delete/${playListID}`)
      .then(async (response) => {
        console.log(response);
        setRefresher(!refresher)
        setShowList(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
    let currentIndex = selectedPlaylist?.findIndex(
      (song) => song?.song === currentSong
    );
    let decrementIndex = currentIndex - 1;
    if (decrementIndex < 0) {
      decrementIndex = selectedPlaylist?.length - 1;
    }
    handlePlayPause(selectedPlaylist[decrementIndex].song);
  };

  const skipForward = () => {
    let currentIndex = selectedPlaylist?.findIndex(
      (song) => song.song === currentSong
    );
    let incrementIndex = currentIndex + 1;
    if (incrementIndex >= selectedPlaylist?.length) {
      incrementIndex = 0;
    }
    handlePlayPause(selectedPlaylist[incrementIndex].song);
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
    const filteredSongs: any = dummyPlayListData?.filter((song) =>
      song?.title?.toLowerCase()?.startsWith(search?.toLowerCase()))
    setSelectedPlaylist(filteredSongs)
  }, [search])

  useEffect(() => {
    getPlayListData();
  }, [refresher]);

  return (
    <div
      className={`flex flex-col lg:flex-row items-start lg:items-center justify-around text-gray-600 w-full h-full p-5 ${showList ? "max-sm:flex-wrap" : "flex-row"}`}>
      {
        isLoading ?
          <DotLoader /> : (
            <>
              <div className="w-full  p-5 lg:p-0">
                <UserProfileCard userProfile={userProfile} />
                <button
                  className="mt-8 px-6 py-3 flex flex-row items-center justify-center gap-3 bg-blue-600 text-white rounded-lg hover:scale-105 hover:bg-blue-700 transition-transform"
                  onClick={openModal}
                >
                  <span>Create Playlist</span>
                  <FaPlus />
                </button>
                <div className="  py-5 w-[45vw] grid grid-cols-3 max-sm:grid-cols-1 max-sm:w-full max-lg:grid-cols-3 gap-6">
                  {
                    playlists?.length !== 0 &&
                    (playlists?.map((playlist) => (
                      <div
                        key={playlist?._id}
                        className="px-4 py-2 bg-black flex flex-row items-center justify-between gap-3 hover:scale-105 transition-transform text-md text-white rounded-lg cursor-pointer"
                      >
                        <div
                          className="flex flex-row items-center gap-2 w-full"
                          onClick={() => handlePlaylistClick(playlist?._id, playlist?.title)}
                        >
                          <RiPlayList2Line className="text-xl" />
                          <span>{initCap(playlist?.title)}</span>
                        </div>
                        <span
                          className="hover:scale-110 transition-transform"
                          onClick={() => deletePlaylist(playlist?._id)}
                        >
                          <FaTrashAlt />
                        </span>
                      </div>
                    )))}
                </div>
              </div>

              <div className="w-full  flex items-center justify-center mt-8 lg:mt-0">
                <div
                  className={`transition-opacity ease-in-out duration-700 rounded-xl shadow-lg h-[75vh] w-full bg-white flex items-center justify-center p-6 ${showList ? 'opacity-100' : 'opacity-0 block'
                    }`}
                >
                  {showList || selectedPlaylist ? (
                    <div
                      id="hide-scrollbar"
                      className="h-full w-full overflow-y-auto">
                      <h2 className="text-2xl text-gray-600 font-bold ">
                        {playListTitle !== "" && initCap(playListTitle)}
                      </h2>

                      <div
                        id="hide-scrollbar"
                        className=" flex flex-col gap-4 items-center justify-center px-10 py-3" >
                        {selectedPlaylist?.length !== 0 ?
                          selectedPlaylist?.map((items: Playlist) => (
                            <div
                              key={items?._id}
                              className=" card w-full cursor-pointer bg-gray-100 text-gray-600 rounded-lg shadow-md p-4 transform transition duration-500 hover:scale-105 hover:shadow-lg  max-sm:w-[41vh]"
                            >
                              <div className="relative flex items-center">
                                <div className="relative w-24 h-24 rounded-md overflow-hidden">
                                  <img
                                    src={items?.thumbnail}
                                    alt={items?.title}
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
                                <div className="ml-4 flex-1">
                                  <div>
                                    <h3 className="text-lg font-semibold ">
                                      {items?.title}
                                    </h3>
                                  </div>
                                  <p className="text-gray-400">{items?.artistName}</p>
                                  <div className="mr-4 flex flex-col items-start justify-start">
                                    <div className="flex items-center gap-3">
                                      <span className="flex flex-row gap-1 items-start text-blue-500 justify-center">
                                        <span>Likes: {items?.likes?.length}</span>
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
                                <div
                                  onClick={() => removeSongFromList(items?._id, items?.playlistID)}
                                  className="p-3 flex items-center justify-center text-white  rounded-full border-none bg-red-600 hover:bg-red-700 hover:scale-105 transition-all">
                                  <FaTrashAlt />
                                </div>
                              </div>
                            </div>
                          )) :
                          <p className="text-gray-500 text-lg">No song items found in your playlist!</p>

                        }
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-lg">Select a playlist to see songs</p>
                  )}
                </div>
              </div>
            </>
          )
      }

      {currentSong !== "" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white text-gray-600 flex items-center justify-between p-4 shadow-lg">
          <div className="flex items-center w-auto">
            <div className="w-12 h-12 mr-4 rounded-xl">
              <img
                src={
                  selectedPlaylist?.find((song) => song.song === currentSong)
                    ?.thumbnail
                }
                alt="current song thumbnail"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="w-auto">
              <h4 className="text-md font-semibold w-auto max-sm:text-sm">
                {selectedPlaylist?.find((song) => song.song === currentSong)?.title}
              </h4>
              <p className="text-sm text-gray-400">
                {
                  selectedPlaylist?.find((song) => song.song === currentSong)
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
      <audio
        ref={audioPlayer}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-white text-gray-600 rounded-lg p-6">
          <h3 className="font-bold text-xl mb-4">Create Playlist</h3>
          <input
            type="text"
            className="input input-bordered bg-gray-100 w-full mb-4 p-2 rounded-md"
            placeholder="Enter Playlist Name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
          <div className="modal-action flex justify-between">
            <button
              className="btn btn-sm border-none text-white bg-blue-500 hover:bg-blue-600 hover:scale-105 transition-transform px-5 py-2 rounded-md"
              onClick={handleCreatePlaylist}
            >
              Create
            </button>
            <button
              className="btn btn-sm border-none text-white bg-red-500 hover:bg-red-600 hover:scale-105 transition-transform px-5 py-2 rounded-md"
              onClick={() => (
                document.getElementById("my_modal_1") as HTMLDialogElement
              ).close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>

  );
};

export default page;
