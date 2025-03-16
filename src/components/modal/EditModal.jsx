"use client";

import { updateImg } from "@/services/authService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function EditModal({
  show,
  onClose,
  userId,
  username,
  setLoading,
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");

  // if (userId) {
  //   console.log("userId in Edit Profile", userId);
  // }

  const handleImageChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpload = async () => {
    try {
      const result = await updateImg(selectedImage, userId);
      // console.log(result);
      if (result.success) {
        setLoading(false);
        // console.log("Image uploaded successfully!", result.imageUrl);
        return { success: true };
      } else {
        setLoading(false);
        // console.log("Error:", result.error);
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setLoading(false);
      // console.log("Upload exception:", error);
      setError(err.message);
      return { success: false, error: error.message };
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    let uploadResult = { success: true };

    if (selectedImage) {
      // console.log("Uploading image...");
      uploadResult = await handleUpload();
      // console.log(uploadResult);
    }

    if ((selectedImage && uploadResult.success) || !selectedImage) {
      // console.log("All changes were successful!");
      // localStorage.clear();
      // router.push("/auth");
      onClose();
    } else {
      // console.log(" operations failed.");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 z-40 bg-[#0084ff57] flex items-center justify-center">
      <div className="md:w-1/2 bg-[#212121] min-h-52 px-6 rounded-3xl">
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-[#222831] font-bold "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={35}
              height={35}
              className="text-[#0084ff] hover:text-[#EEEEEE] transition-all duration-300 hover:rotate-90"
              fill={"none"}
            >
              <path
                d="M10.2471 6.7402C11.0734 7.56657 11.4866 7.97975 12.0001 7.97975C12.5136 7.97975 12.9268 7.56658 13.7531 6.74022L13.7532 6.7402L15.5067 4.98669L15.5067 4.98668C15.9143 4.5791 16.1182 4.37524 16.3302 4.25283C17.3966 3.63716 18.2748 4.24821 19.0133 4.98669C19.7518 5.72518 20.3628 6.60345 19.7472 7.66981C19.6248 7.88183 19.421 8.08563 19.0134 8.49321L17.26 10.2466C16.4336 11.073 16.0202 11.4864 16.0202 11.9999C16.0202 12.5134 16.4334 12.9266 17.2598 13.7529L19.0133 15.5065C19.4209 15.9141 19.6248 16.1179 19.7472 16.3299C20.3628 17.3963 19.7518 18.2746 19.0133 19.013C18.2749 19.7516 17.3965 20.3626 16.3302 19.7469C16.1182 19.6246 15.9143 19.4208 15.5067 19.013L13.7534 17.2598L13.7533 17.2597C12.9272 16.4336 12.5136 16.02 12.0001 16.02C11.4867 16.02 11.073 16.4336 10.2469 17.2598L10.2469 17.2598L8.49353 19.013C8.0859 19.4208 7.88208 19.6246 7.67005 19.7469C6.60377 20.3626 5.72534 19.7516 4.98693 19.013C4.2484 18.2746 3.63744 17.3963 4.25307 16.3299C4.37549 16.1179 4.5793 15.9141 4.98693 15.5065L6.74044 13.7529C7.56681 12.9266 7.98 12.5134 7.98 11.9999C7.98 11.4864 7.5666 11.073 6.74022 10.2466L4.98685 8.49321C4.57928 8.08563 4.37548 7.88183 4.25307 7.66981C3.63741 6.60345 4.24845 5.72518 4.98693 4.98669C5.72542 4.24821 6.60369 3.63716 7.67005 4.25283C7.88207 4.37524 8.08593 4.5791 8.49352 4.98668L8.49353 4.98669L10.2471 6.7402Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <form
          onSubmit={handleChange}
          className="flex flex-col items-center justify-center md:w-full min-h-52"
        >
          <h1 className="md:text-2xl text-xl text-[#EEEEEE]">Upload Images</h1>
          {/* Custom File Input Button */}
          <div className="mt-2 relative">
            <input
              type="file"
              id="myFile"
              name="filename"
              className="hidden"
              onChange={handleImageChange}
            />
            <label
              htmlFor="myFile"
              className="font-semibold cursor-pointer inline-flex items-center gap-4 justify-center bg-[#0084ff] text-[#EEEEEE] hover:bg-[#393E46] transition-all duration-300 rounded-full px-6 py-2"
            >
              {/* SVG Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={30}
                height={30}
                fill={"none"}
              >
                <path
                  d="M13 3.00231C12.5299 3 12.0307 3 11.5 3C7.02166 3 4.78249 3 3.39124 4.39124C2 5.78249 2 8.02166 2 12.5C2 16.9783 2 19.2175 3.39124 20.6088C4.78249 22 7.02166 22 11.5 22C15.9783 22 18.2175 22 19.6088 20.6088C20.9472 19.2703 20.998 17.147 20.9999 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M2 14.1354C2.61902 14.0455 3.24484 14.0011 3.87171 14.0027C6.52365 13.9466 9.11064 14.7729 11.1711 16.3342C13.082 17.7821 14.4247 19.7749 15 22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 16.8962C19.8246 16.3009 18.6088 15.9988 17.3862 16.0001C15.5345 15.9928 13.7015 16.6733 12 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 4.5C17.4915 3.9943 18.7998 2 19.5 2M22 4.5C21.5085 3.9943 20.2002 2 19.5 2M19.5 2V10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Select a Image
            </label>
          </div>
          {/* Image Preview */}
          {selectedImage && (
            <div className="mt-4">
              <img
                src={selectedImage}
                alt="Selected Preview"
                className="w-auto md:h-80 h-32 rounded-xl object-cover mx-auto"
              />
            </div>
          )}
          {/* Username Input */}
          <button
            type="submit"
            className="bg-[#0084ff] mt-4  py-2 px-6 md:text-2xl mb-10 text-lg rounded-2xl transition-all duration-300 hover:bg-[#EEEEEE] text-[#212121] font-bold"
          >
            Upload
          </button>
        </form>
        {error && (
          <p className="text-[#ff2828] text-center text-sm  mb-5">{error}</p>
        )}
      </div>
    </div>
  );
}
