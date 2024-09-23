"use client"
import DotLoader from '@/components/DotLoader'
import Helpers from '@/config/Helpers'
import axios from 'axios'
import Loadable from 'next/dist/shared/lib/loadable.shared-runtime'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { LoaderIcon } from 'react-hot-toast'

interface FollowedArtist {
  _id: string,
  name: string,
  email: string,
  password: string,
  image: string,
  songs: string[],
  followStatus: Boolean,
  followers: string[],
  createdAt: Date,
  updatedAt: Date,
}



const page = () => {
  const defaultFollowedArtistValues = {
    _id: "",
    name: "",
    email: "",
    password: "",
    image: "",
    songs: [],
    followStatus: false,
    followers: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const [followedArtist, setFollowedArtist] = useState<FollowedArtist[]>([defaultFollowedArtistValues])
  const [loading, setLoading] = useState<Boolean>(true)
  const [refresher, setRefresher] = useState<Boolean>(true)

  function initCap(str: string): string {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const getFollowedArtists = () => {
    axios.get("/api/user/get-followed-artists", Helpers.authHeaders)
      .then((response) => {
        setFollowedArtist(response.data.followedArtists)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const followArtist = (artistProfileID: string) => {
    axios.get(`/api/user/follow-artist/${artistProfileID}`, Helpers.authHeaders)
      .then((response) => {
        setRefresher(!refresher)
      })
      .catch((error) => {
        console.log(error)
      })
  }


  useEffect(() => {
    getFollowedArtists()
  }, [refresher])

  return (
    <div className='w-full flex items-center p-10 justify-center h-full text-gray-600' >
      {
        loading ?
          <DotLoader /> : (
            <div className="overflow-x-auto bg-white rounded-xl px-10 py-7">
              <table className="table p-10">
                <thead className='text-gray-600' >
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Songs</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody  >
                  {
                    (followedArtist?.length > 0) ? (
                      followedArtist.map((items: FollowedArtist) => (
                        <tr
                          className='hover:scale-105 transition-all cursor-pointer'
                        >
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <Link href={`/user/artist-profile/${items?._id}`}>
                                  <div className="mask mask-squircle hover:scale-105 transition-all h-12 w-12">
                                    <img
                                      src={items.image}
                                      alt="Avatar Tailwind CSS Component" />
                                  </div>
                                </Link>
                              </div>
                              <div>
                                <div className="font-bold">{initCap(items?.name)}</div>
                                <div className="text-sm opacity-50">Followers: {items.followers.length}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            {items?.email}
                            <br />
                          </td>
                          <td>{items?.songs?.length}</td>
                          <th>
                            <button
                              onClick={() => followArtist(items?._id)}
                              className="btn text-white hover:scale-110 transition-all btn-xs">{items.followStatus ? "Unfollow" : "Follow"}</button>
                          </th>
                        </tr>
                      ))
                    ):
                    <div className='w-full h-full text-center p-3 ' >
                      No followed artist found
                    </div>
                  }
                </tbody>

              </table>
            </div>
          )
      }
    </div>
  )
}

export default page