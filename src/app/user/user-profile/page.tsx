"use client"
import { useSearchContext } from '@/app/context/SearchContext';
import UserProfileCard from '@/components/UserProfileCard';
import Helpers from '@/config/Helpers';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { RiPlayList2Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
interface UserProfile {
    _id: string;
    name: string;
    image: string;
    email: string;
    songs: string[];
    followers: string[];
}

interface Playlist {
    id: string;
    name: string;
    songs: string[];
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
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
    const [showList, setShowList] = useState<Boolean>(false);
    const [newPlaylistName, setNewPlaylistName] = useState<string>("");

    function initCap(str: string): string {
        return str
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    }

    const userData = () => {
        axios.get("/api/user/profile", Helpers.authFileHeaders)
            .then((response) => {
                console.log(response.data)
                setUserProfile(response.data.userProfile);
            }).catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        userData();
        const dummyPlaylists: Playlist[] = [
            { id: "1", name: "Chill Vibes", songs: ["Song 1", "Song 2", "Song 3"] },
            { id: "2", name: "Workout Hits", songs: ["Song 4", "Song 5", "Song 6"] },
            { id: "3", name: "Old Classics", songs: ["Song 7", "Song 8", "Song 9"] },
            { id: "3", name: "Old Classics", songs: ["Song 7", "Song 8", "Song 9"] },
            { id: "3", name: "Old Classics", songs: ["Song 7", "Song 8", "Song 9"] },
            { id: "3", name: "Old Classics", songs: ["Song 7", "Song 8", "Song 9"] },
            { id: "3", name: "Old Classics", songs: ["Song 7", "Song 8", "Song 9"] },
            { id: "3", name: "Old Classics", songs: ["Song 7", "Song 8", "Song 9"] },
        ];
        setPlaylists(dummyPlaylists);
    }, []);

    const handleCreatePlaylist = () => {
        const formData = new FormData()
        if (newPlaylistName) {
            formData.append("title", newPlaylistName)
            axios.post("/api/playlist/create", formData, Helpers.authFileHeaders)
                .then((response) => {
                    console.log(response.data)
                })
                .catch((error) => {
                    console.log(error)
                })
            const dialog = document.getElementById('my_modal_1') as HTMLDialogElement;
            dialog?.close();
            setNewPlaylistName("");
        }
    };

    const handlePlaylistClick = (playlist: Playlist) => {
        setShowList(true);
        setSelectedPlaylist(playlist);
    };

    const openModal = () => {
        const dialog = document.getElementById('my_modal_1') as HTMLDialogElement;
        dialog?.showModal();
    };

    return (
        <div className='flex items-center justify-center text-gray-600 w-full h-full p-5'>
            <div className='w-1/3'>
                <UserProfileCard userProfile={userProfile} />
                <button
                    className="mt-5 px-4 flex flex-row items-center justify-center gap-2 py-2 bg-blue-600  text-white rounded-xl hover:scale-110 hover:bg-blue-700 transition-all"
                    onClick={openModal}
                >
                    <span>Create Playlist</span><FaPlus />
                </button>
                <div className="mt-5 w-full  min-w-[35vw] flex flex-row flex-wrap gap-3">
                    {playlists.map((playlist) => (
                        <div key={playlist.id}
                            className="p-3 bg-black hover:scale-110 flex flex-row items-center justify-center gap-2 transition-all   text-md text-white rounded-lg mb-3 cursor-pointer"
                        >
                            <RiPlayList2Line
                                onClick={() => handlePlaylistClick(playlist)}
                                className='text-lg' />
                            <span
                                onClick={() => handlePlaylistClick(playlist)}
                            >{initCap(playlist.name)}
                            </span>

                            <span className='hover:scale-110 transition-all' onClick={() => setShowList(false)}>
                                <FaTrashAlt />
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <dialog id="my_modal_1" className="modal">
                <div className="modal-box bg-white text-gray-600">
                    <h3 className="font-bold text-lg">Create Playlist</h3>
                    <input
                        type="text"
                        className="input input-bordered bg-gray-100 w-full my-4"
                        placeholder="Enter Playlist Name"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                    />
                    <div className="modal-action">
                        <button className="btn btn-sm text-white border-none bg-blue-500 hover:bg-blue-600 hover:scale-110 transition-all " onClick={handleCreatePlaylist}>Create</button>
                        <button className="btn btn-sm text-white border-none bg-red-500 hover:bg-red-600 hover:scale-110 transition-all" onClick={() => (document.getElementById('my_modal_1') as HTMLDialogElement).close()}>Cancel</button>
                    </div>
                </div>
            </dialog>

            <div className={showList ? `w-2/3 p-5 bg-gray-100` : "w-2/3 p-5 hidden bg-gray-100"}>
                {selectedPlaylist ? (
                    <>
                        <h2 className="text-xl text-gray-600 font-bold mb-4">{initCap(selectedPlaylist.name)}</h2>
                        <ul>
                            {selectedPlaylist.songs.map((song, index) => (
                                <li key={index} className="mb-2">{song}</li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p>Select a playlist to see songs</p>
                )}
            </div>
        </div>
    );
};

export default page;
