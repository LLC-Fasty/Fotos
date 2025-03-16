"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function SuccessModal({
  show,
  onClose,
  text,
  buttonText,
  route,
}) {
  if (!show) return null;
  const router = useRouter();
  return (
    <div className="fixed inset-0 bg-opacity-50 z-40 bg-[#eeeeee71] flex items-center justify-center">
      <div className="md:w-1/2 w-full md:mx-0 mx-6 flex items-center justify-center bg-[#212121] py-10 px-6 rounded-3xl">
        <div>
          <h1 className="md:text-4xl text-center text-[#0083ff] font-bold mb-6 tracking-wider">
            {text}
          </h1>

          <div></div>
          <div className="flex justify-center gap-4 mt-4">
            {!route ? (
              <>
                <button
                  className="flex justify-center items-center gap-4 px-4 bg-[#FEFFF7] text-[#212121] text-xl py-2 rounded-xl font-bold hover:bg-[#0083ff] hover:text-[#212121] transition-all duration-300"
                  onClick={onClose}
                >
                  {buttonText ? buttonText : "Close"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push(route)}
                  className="flex justify-center items-center gap-4 px-4 bg-[#FEFFF7] text-[#212121] text-xl py-2 rounded-xl font-bold hover:bg-[#0083ff] hover:text-[#212121] transition-all duration-300"
                >
                  {buttonText ? buttonText : "Close"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
