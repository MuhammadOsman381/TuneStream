"use client";

import Helpers from "@/config/Helpers";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { PiUploadSimple } from "react-icons/pi";

const EditSong :React.FC<any> = ({songValues}) => {
  const router = useRouter();
  const [songID, setSongID] = useState<string>(songValues._id);
  const [title, setTitle] = useState<string>(songValues.title);
  const [song, setSong] = useState<any>(songValues.song);
  const [thumbnail, setThumbnail] = useState<File | null | string>(songValues.thumbnail);
  const [songPreview, setSongPreview] = useState<any>(songValues.song);
  const [thumbnailPreview, setThumbnailPreview] = useState<any>(songValues.thumbnail);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSong(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader?.result === "string") {
          setSongPreview(reader?.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(title, song, thumbnail, songID);
    if (!title || !song || !thumbnail) {
      toast.error("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("song", song);
    formData.append("thumbnail", thumbnail);

    try {
      await axios
        .put(`/api/song/edit/${songID}`, formData, Helpers.authFileHeaders)
        .then((response) => {
          console.log(response.data);
          toast.success(response.data.message);
        //   router.push("/artists/home");
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center p-5">
      <div className="flex w-full max-w-[30rem] flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
        <div className="p-6">
          <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="title"
                className="block mb-2 font-sans text-sm font-medium text-blue-gray-900"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="Post title..."
                className="peer h-full w-full outline-none rounded-lg border border-blue-gray-200 bg-transparent px-3 py-2.5 text-sm text-blue-gray-700  transition-all focus:border-2 focus:border-gray-900"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <p className="block font-sans mb-3 text-sm font-medium text-blue-gray-900">
                Add Song
              </p>
              <label
                htmlFor="song-dropbox"
                className="flex cursor-pointer justify-center rounded-md border border-dashed border-gray-300 bg-white px-3 py-6 text-sm transition hover:border-gray-400 focus:border-solid focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <span className="flex items-center space-x-2">
                  {songPreview ? (
                    <audio
                      src={songPreview}
                      controls
                      className="h-16 w-96 object-cover rounded-xl"
                    />
                  ) : (
                    <>
                      <svg
                        className="h-6 w-6 stroke-gray-400"
                        viewBox="0 0 256 256"
                      >
                        <path
                          d="M96,208H72A56,56,0,0,1,72,96a57.5,57.5,0,0,1,13.9,1.7"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="24"
                        ></path>
                        <path
                          d="M80,128a80,80,0,1,1,144,48"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="24"
                        ></path>
                        <polyline
                          points="118.1 161.9 152 128 185.9 161.9"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="24"
                        ></polyline>
                        <line
                          x1="152"
                          y1="208"
                          x2="152"
                          y2="128"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="24"
                        ></line>
                      </svg>
                      <span className="text-xs font-medium text-gray-600">
                        Drop or Attach Song here
                      </span>
                    </>
                  )}
                </span>
                <input
                  id="song-dropbox"
                  type="file"
                  accept="audio/*"
                  className="sr-only "
                  onChange={handleVideoUpload}
                />
              </label>
            </div>
            <div>
              <p className="block font-sans text-sm font-medium text-blue-gray-900 mb-3">
                Add Thumbnail
              </p>
              <label
                htmlFor="thumbnail-dropbox"
                className="flex cursor-pointer justify-center rounded-md border border-dashed border-gray-300 bg-white px-3 py-6 text-sm transition hover:border-gray-400 focus:border-solid focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <span className="flex items-center space-x-2">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      className="h-full w-full object-cover rounded-xl"
                    />
                  ) : (
                    <>
                      <svg
                        className="h-6 w-6 stroke-gray-400"
                        viewBox="0 0 256 256"
                      >
                        <path
                          d="M96,208H72A56,56,0,0,1,72,96a57.5,57.5,0,0,1,13.9,1.7"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="24"
                        ></path>
                        <path
                          d="M80,128a80,80,0,1,1,144,48"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="24"
                        ></path>
                        <polyline
                          points="118.1 161.9 152 128 185.9 161.9"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="24"
                        ></polyline>
                        <line
                          x1="152"
                          y1="208"
                          x2="152"
                          y2="128"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="24"
                        ></line>
                      </svg>
                      <span className="text-xs font-medium text-gray-600">
                        Drop or Attach Thumbnail file
                      </span>
                    </>
                  )}
                </span>
                <input
                  id="thumbnail-dropbox"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <button
              className="select-none rounded-lg bg-blue-600 hover:bg-blue-600 hover:scale-105 transition-all py-3.5 px-7 text-center font-sans text-sm font-semibold uppercase text-white shadow-md shadow-gray-900/10  hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="submit"
            >
              <span className="flex items-center justify-center gap-2">
                <span>Edit</span>
                <PiUploadSimple />
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSong;
