"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function LogOutModal({ show, onClose }) {
  const router = useRouter();
  if (!show) return null;
  const logOut = () => {
    // console.log("logging out...");
    localStorage.clear();
    router.push("/");
  };
  return (
    <div className="fixed inset-0 bg-opacity-50 z-40 bg-[#eeeeee71] flex items-center justify-center">
      <div className="md:w-1/2 w-full md:mx-0 mx-6 flex items-center justify-center bg-[#212121] py-10 px-6 rounded-3xl">
        <div>
          <div>
            <h1 className="md:text-lg text-sm font-bold text-[#0083ff] text-right">
              Do you Want to Log Out?
            </h1>
          </div>
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex justify-center items-center w-full gap-4 px-4 bg-[#EEEEEE] text-[#212121] text-xl py-2 rounded-xl font-bold hover:bg-[#0083ff] transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={logOut}
              className="flex justify-center items-center  w-full gap-4 px-4 bg-[#f10000] text-[#EEEEEE] text-xl py-2 rounded-xl font-bold hover:bg-[#0083ff] hover:text-[#001229] transition-all duration-300"
            >
              LogOut
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
