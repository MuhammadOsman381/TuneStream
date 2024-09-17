"use client";
import NavBar from "@/components/NavBar";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const [userType, setUserType] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [image, setImage] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<any>(null);

  const fileInputRef = useRef<any>(null);

  const handleIconClick = (): any => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const signup = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", image);
    formData.append("usertype", userType);

    axios
      .post("/api/user/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success(response.data.message);
        router.push("/");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error.response.data.message)
      });
  };

  return (
    <div>
      <NavBar />
      <section className="bg-transparent text-gray-600 ">
        <div className=" flex  items-center justify-center  mx-auto md:h-full p-5">
          <div className="w-full bg-white rounded-xl shadow-lg  sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight  md:text-2xl">
                Sign up to your account
              </h1>
              <form
                onSubmit={signup}
                className="space-y-4 md:space-y-3"
                action="#"
              >
                <div>
                  <div className="flex flex-col items-center">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Uploaded"
                          className="w-20 h-20 rounded-full cursor-pointer object-cover border border-gray-300"
                          onClick={handleIconClick}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </>
                    ) : (
                      <div className="flex items-center justify-center w-20 h-20 border border-gray-300 rounded-full">
                        <FaUser
                          className="text-gray-400 w-10 h-10 cursor-pointer"
                          onClick={handleIconClick}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium "
                  >
                    Your name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-100 border-none   rounded-lg outline-none w-full p-2.5"
                    placeholder="name..."
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium "
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-100 border-none   rounded-lg outline-none w-full p-2.5"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium "
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-100 border-none  rounded-lg outline-none w-full p-2.5"
                    required
                  />
                </div>

                <div>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className="select select-none w-full    bg-gray-100 select-sm "
                  >
                    <option>user</option>
                    <option>artist</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Sign in
                </button>
                <p className="text-sm font-light text-gray-500">
                  if you have an account ?{" "}
                  <Link
                    href="/"
                    className="font-medium text-primary-600 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
