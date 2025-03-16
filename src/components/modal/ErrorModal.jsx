import React from "react";

export default function ErrorModal({ show, onClose, errorText }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-opacity-50 z-40 bg-[#eeeeee71] flex items-center justify-center">
      <div className="md:w-1/2 w-full md:mx-0 mx-6 flex items-center justify-center bg-[#212121] py-10 px-6 rounded-3xl">
        <div>
          <h1 className="md:text-4xl text-center text-[#0083ff] font-bold mb-6 tracking-wider">
            Error
          </h1>

          <div>
            <h1 className="md:text-base text-sm font-bold text-[#EEEEEE] text-right">
              {errorText}
            </h1>
          </div>
          <div className="flex justify-between gap-4 mt-4">
            <button
              className="flex justify-center items-center  w-full gap-4 px-4 bg-[#f10000] text-[#FEFFF7] text-xl py-2 rounded-xl font-bold hover:bg-[#0083ff] hover:text-[#212121] transition-all duration-300"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
