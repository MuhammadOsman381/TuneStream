"use client";
import axios from "axios";
import React, { useEffect } from "react";

const page = () => {
  const getArtistData = () => {
    const artistId = localStorage.getItem("artistId");
    axios
      .get(`/api/artist/gotoProfile/${artistId}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getArtistData();
  }, []);

  return <div>page</div>;
};

export default page;
