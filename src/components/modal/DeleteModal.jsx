"use client";
import { DeleteImages } from "@/services/authService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function DeleteModal({ show, onClose, id, userId, setLoading }) {
  if (!show) return null;
  // console.log(id);
  const router = useRouter();
  const [errs, setErrs] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { success, error } = await DeleteImages(id, userId);
      if (error) {
        setLoading(false);
        setErrs(error);
      }
      if (success) {
        setLoading(false);
        onClose();
        window.location.reload();
      }
    } catch (err) {
      setLoading(false);
      setErrs(err.message);
    }
  };
  return (
    <div className="fixed inset-0 bg-opacity-50 z-40 bg-[#eeeeee71] flex items-center justify-center">
      <div className="md:w-1/2 w-full md:mx-0 mx-6 flex items-center justify-center bg-[#212121] py-10 px-6 rounded-3xl">
        <div>
          <h1 className="md:text-4xl text-center text-[#0083ff] font-bold mb-6 tracking-wider">
            Do You Want to Delete This Image?
          </h1>

          <div className="flex items-center justify-center gap-4">
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleDelete}
                className="flex justify-center items-center gap-4 px-4 bg-[#f10000] text-[#EEEEEE] text-xl py-2 rounded-xl font-bold hover:bg-[#0083ff] hover:text-[#212121] transition-all duration-300"
              >
                Yes
              </button>
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex justify-center items-center gap-4 px-4 bg-[#0083ff] text-[#212121] text-xl py-2 rounded-xl font-bold hover:bg-[#0083ff] hover:text-[#212121] transition-all duration-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
      {errs && <span>{errs}</span>}
    </div>
  );
}
