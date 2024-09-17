"use client";
import { useSearchContext } from "@/app/context/SearchContext";
import Helpers from "@/config/Helpers";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  FaTimes,
  FaThumbsUp,
  FaThumbsDown,
  FaPaperPlane,
  FaRegThumbsUp,
  FaRegThumbsDown,
} from "react-icons/fa";

interface DrawerInterface {
  _id: string;
  title: string;
  thumbnail: string;
  artistName: string;
  likes: string[];
  dislikes: string[];
  createdAt: Date;
}

interface DrawerProps {
  isOpen: boolean;
  drawerValues: DrawerInterface;
}

interface DefaultLikedOrDisliked {
  likedStatus: Boolean;
  dislikedStatus: Boolean;
  likes: number;
  dislikes: number;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, drawerValues }) => {
  const defaultLikedOrDislikedStatus: DefaultLikedOrDisliked = {
    likedStatus: false,
    dislikedStatus: false,
    likes: 0,
    dislikes: 0,
  };
  const { isLikedOrDislikeState, setIsLikedOrDislikeState } =
    useSearchContext();
  const endOfCommentRef = useRef<any>(null);
  const [open, setOpen] = useState<Boolean>(isOpen);
  const [comment, setComment] = useState<string>("");
  const [commentsArray, setCommentsArray] = useState([]);
  const [likedOrDislikedStatus, setLikedOrDislikedStatus] =
    useState<DefaultLikedOrDisliked>(defaultLikedOrDislikedStatus);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (endOfCommentRef.current) {
      endOfCommentRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [commentsArray]);

  const closeDrawer = () => {
    setOpen(false);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleSendComment = () => {
    const formData = new FormData();
    formData.append("songId", drawerValues._id);
    formData.append("comment", comment);

    axios
      .post("/api/comment/add", formData, Helpers.authFileHeaders)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSongComments = () => {
    axios
      .get(`/api/comment/get/${drawerValues._id}`, Helpers.authHeaders)
      .then((response) => {
        console.log(response.data.comments);
        setCommentsArray(response.data.comments);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUserLikedOrDislikedDetails = () => {
    axios
      .get(
        `/api/user/likedOrDislikedStatus/${drawerValues._id}`,
        Helpers.authHeaders
      )
      .then((response) => {
        console.log(response.data);
        setLikedOrDislikedStatus({
          likedStatus: response.data.likedStatus,
          dislikedStatus: response.data.dislikedStatus,
          likes:response.data.likes,
          dislikes:response.data.dislikes
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function initCap(str: string): string {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const likeSong = () => {
    axios
      .get(`/api/song/like/${drawerValues._id}`, Helpers.authHeaders)
      .then((response) => {
        console.log(response);
        setIsLikedOrDislikeState(!isLikedOrDislikeState);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const dislikeSong = () => {
    axios
      .get(`/api/song/dislike/${drawerValues._id}`, Helpers.authHeaders)
      .then((response) => {
        console.log(response);
        setIsLikedOrDislikeState(!isLikedOrDislikeState);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUserLikedOrDislikedDetails();
  }, [isLikedOrDislikeState]);

  useEffect(() => {
    getSongComments();
  }, []);

  return (
    <>
      <div
        className={`${
          open ? "fixed inset-0 bg-black bg-opacity-50 z-40" : "hidden"
        }`}
        aria-hidden="true"
        onClick={closeDrawer}
      ></div>

      <div
        tabIndex={-1}
        className={`overflow-auto fixed top-0 right-0 h-full bg-white shadow-xl transition-transform transform ${
          open ? "translate-x-0" : "translate-x-full"
        } w-[30vw] max-sm:w-[80vw] z-50 flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        <div className="p-3 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-600">
            {drawerValues.title}
          </h2>
          <button onClick={closeDrawer} aria-label="Close Drawer">
            <FaTimes className="text-gray-600 text-2xl" />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden shadow-md">
            <img
              src={drawerValues.thumbnail}
              alt={drawerValues.title}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="px-6 space-y-2">
          <p className="text-md text-gray-600">
            By {initCap(drawerValues.artistName)}
          </p>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-blue-500">
              {likedOrDislikedStatus.likedStatus ? (
                <FaThumbsUp
                  onClick={likeSong}
                  className="text-xl cursor-pointer"
                />
              ) : (
                <FaRegThumbsUp
                  onClick={likeSong}
                  className="text-xl cursor-pointer"
                />
              )}

              <span>{likedOrDislikedStatus.likes}</span>
            </div>
            <div className="flex items-center space-x-2 text-red-500">
              {likedOrDislikedStatus.dislikedStatus ? (
                <FaThumbsDown
                  onClick={dislikeSong}
                  className="text-xl cursor-pointer "
                />
              ) : (
                <FaRegThumbsDown
                  onClick={dislikeSong}
                  className="text-xl cursor-pointer"
                />
              )}

              <span>{likedOrDislikedStatus.dislikes}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Added on:{" "}
            {new Date(drawerValues.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className=" w-full flex flex-col">
          <div className="w-full px-6 py-2 flex flex-col">
            <h5 className="text-lg font-semibold text-gray-600 mb-2">
              Comments
            </h5>
            <div className="min-h-[35vh] max-sm:min-h-[50vh]">
              {commentsArray?.length !== 0 &&
                commentsArray?.map((items: any) => (
                  <div className="flex items-start px-4 py-2 bg-gray-100  rounded-lg mb-2 space-x-4">
                    <img
                      src={items?.user.image}
                      alt={`${initCap(items?.user?.userData?.name)} profile`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="flex flex-row items-center justify-center gap-4  mb-1">
                        <span className="font-semibold text-gray-600">
                          {initCap(items?.user?.userData?.name)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(items?.comment?.createdAt).toLocaleString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <p className="text-gray-600">{items.comment.content}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div ref={endOfCommentRef}></div>

          <div className=" border-t h-[10vh] border-t-gray-300 flex flex-col mt-auto px-4 py-3 ">
            <div className="flex">
              <input
                type="text"
                value={comment}
                onChange={handleCommentChange}
                placeholder="Add a comment..."
                className="flex-grow px-4 py-2  bg-gray-100 outline-none  text-gray-500 rounded-l-lg"
              />
              <button
                onClick={handleSendComment}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-lg flex items-center justify-center"
                aria-label="Send Comment"
              >
                <FaPaperPlane className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
