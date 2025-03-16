"use client";
import DisplayImages from "@/components/DisplayImages";
import EditModal from "@/components/modal/EditModal";
import ErrorModal from "@/components/modal/ErrorModal";
import LogOutModal from "@/components/modal/LogOutModal";
import SessionModal from "@/components/modal/SessionModal";
import SuccessModal from "@/components/modal/SuccessModal";
import useGatherData from "@/hooks/useGatherData";
import useUserData from "@/hooks/useUserData";
import { userLogs, validLoginSession } from "@/services/authService";
import { useRouter } from "next/navigation";
// import useGatherData from "@/hooks/useGatherData";
import React, { useEffect, useState } from "react";

export default function MyPhotos() {
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSessionOver, setShowSessionOver] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [errorPresent, setErrorPresent] = useState(false);
  const [showLogOut, setShowLogOut] = useState(false);
  const [iData, setIData] = useState({});
  const router = useRouter();

  const { userId, username, uData, setUsername } = useGatherData({
    setLoading,
    setErrors,
    setShowSessionOver,
    setErrorPresent,
    setIData,
  });

  const handleError = (error) => {
    setLoading(false);
    setErrors(error);
    setShowError(true);
  };

  useEffect(() => {
    const handleiferror = () => {
      if (errorPresent) {
        handleError(errors);
      }
      if (!showError) {
        setErrorPresent(false);
      }
    };
    handleiferror();
  }, []);

  useUserData({ userId, setIData });

  const handleLogOut = async () => {
    setShowLogOut(true);
    const event = "logout";
    const logofAct = await userLogs(userId, event);
    // console.log("log:", logofAct);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-[#0083ff] md:text-6xl text-xl font-black">
          Chill & Wait....
        </h1>
      </div>
    );
  }
  return (
    <div className="md:container md:mx-auto mx-2 py-2">
      <div className="flex justify-between items-center md:px-6 px-2 bg-[#212121] py-2 rounded-2xl">
        <h1 className="text-center text-[#0083ff] font-black md:text-4xl text-2xl">
          Fotos
        </h1>
        <div className="flex justify-center items-center md:gap-10 gap-4">
          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="text-[#EEEEEE] hover:text-[#0083ff] text-lg cursor-pointer flex justify-center items-center gap-1 transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-6"
              fill={"none"}
            >
              <path
                d="M12 8V16M16 12L8 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            Add
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="font-bold text-xl text-[#0083ff] bg-[#EEEEEE] size-12 py-1 rounded-full shadow-md hover:bg-gray-100 transition cursor-pointer"
          >
            {/* Fasty Kumar */}
            {`${username}`.substring(0, 2).toUpperCase()}
          </button>
          {isOpen && (
            <div className="absolute md:top-16 top-12 md:mt-1 mt-6  md:w-32 bg-[#EEEEEE] border border-[#EEEEEE] rounded-lg shadow-lg px-4">
              <button
                type="button"
                onClick={handleLogOut}
                className="text-[#f72222] hover:text-[#0083ff] font-black text-lg cursor-pointer flex justify-center items-center gap-1 transition-all duration-300 my-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-6"
                  fill={"none"}
                >
                  <path
                    d="M15 17.625C14.9264 19.4769 13.3831 21.0494 11.3156 20.9988C10.8346 20.987 10.2401 20.8194 9.05112 20.484C6.18961 19.6768 3.70555 18.3203 3.10956 15.2815C3 14.723 3 14.0944 3 12.8373L3 11.1627C3 9.90561 3 9.27705 3.10956 8.71846C3.70555 5.67965 6.18961 4.32316 9.05112 3.51603C10.2401 3.18064 10.8346 3.01295 11.3156 3.00119C13.3831 2.95061 14.9264 4.52307 15 6.37501"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M21 12H10M21 12C21 11.2998 19.0057 9.99153 18.5 9.5M21 12C21 12.7002 19.0057 14.0085 18.5 14.5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="bg-[#d3d3d3] mt-6 p-4 rounded-3xl">
        <DisplayImages iData={iData} setLoading={setLoading} />
      </div>
      {showLogOut && (
        <LogOutModal show={showLogOut} onClose={() => setShowLogOut(false)} />
      )}
      {showError && (
        <ErrorModal
          show={showError}
          onClose={() => setShowError(false)}
          errorText={errors}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          text={"OTP Matched!!"}
          buttonText={"let's Change Password"}
          // route={"/signin"}
        />
      )}
      {showSessionOver && (
        <SessionModal
          show={showSessionOver}
          onClose={() => setShowSessionOver(false)}
        />
      )}
      {showEditModal && (
        <EditModal
          show={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            // window.location.reload();
          }}
          userId={userId}
          setLoading={setLoading}
        />
      )}
    </div>
  );
}
