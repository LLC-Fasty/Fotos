"use client";
import React, { useState } from "react";
import SuccessModal from "./modal/SuccessModal";
import ErrorModal from "./modal/ErrorModal";
import { findAccount } from "@/services/authService";
import { connectRustFun } from "@/services/connectService";

export default function SignIn({ setActiveTab }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleError = (error) => {
    setLoading(false);
    setErrors(error);
    setShowError(true);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // console.log("signup");
      // console.log("Data: ", username, password);

      const userData = { username, password };
      const { success, error } = await findAccount(userData);
      if (error) {
        handleError(error);
      }
      if (success) {
        setShowSuccessModal(true);
      }
    } catch (err) {
      handleError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ShowPasswordIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="md:w-10 w-8 text-[#212121]"
      fill={"none"}
    >
      <path
        d="M21.544 11.045C21.848 11.4713 22 11.6845 22 12C22 12.3155 21.848 12.5287 21.544 12.955C20.1779 14.8706 16.6892 19 12 19C7.31078 19 3.8221 14.8706 2.45604 12.955C2.15201 12.5287 2 12.3155 2 12C2 11.6845 2.15201 11.4713 2.45604 11.045C3.8221 9.12944 7.31078 5 12 5C16.6892 5 20.1779 9.12944 21.544 11.045Z"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z"
        stroke="currentColor"
        fill="#0083ff"
        strokeWidth="2.5"
      />
    </svg>
  );

  const HidePasswordIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="md:w-10 w-8 text-[#212121]"
      fill={"none"}
    >
      <path
        d="M19.439 15.439C20.3636 14.5212 21.0775 13.6091 21.544 12.955C21.848 12.5287 22 12.3155 22 12C22 11.6845 21.848 11.4713 21.544 11.045C20.1779 9.12944 16.6892 5 12 5C11.0922 5 10.2294 5.15476 9.41827 5.41827M6.74742 6.74742C4.73118 8.1072 3.24215 9.94266 2.45604 11.045C2.15201 11.4713 2 11.6845 2 12C2 12.3155 2.15201 12.5287 2.45604 12.955C3.8221 14.8706 7.31078 19 12 19C13.9908 19 15.7651 18.2557 17.2526 17.2526"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="#0083ff"
        strokeLinejoin="round"
      />
      <path
        d="M9.85786 10C9.32783 10.53 9 11.2623 9 12.0711C9 13.6887 10.3113 15 11.9289 15C12.7377 15 13.47 14.6722 14 14.1421"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M3 3L21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

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
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full md:w-[600px]">
        <h1 className="text-center text-[#0083ff] font-black md:text-4xl text-2xl">
          Fotos
        </h1>
        <form
          onSubmit={handleSignIn}
          className="border-6 border-[#212121] px-4 py-8 rounded-4xl mx-4 mt-4"
        >
          <h1 className="text-[#0083ff] md:text-8xl text-6xl font-black text-center">
            Sign In
          </h1>
          <h2 className="text-[#0083ff] md:text-4xl text-xl font-black mt-4 text-center">
            Welcome back!
          </h2>
          <div className="mt-8 flex items-center gap-2">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="md:text-2xl text-lg font-bold placeholder:text-[#EEEEEE] bg-[#212121] px-4 py-2 rounded-lg focus:rounded-3xl text-center outline-none text-[#0083ff] transition-all duration-300 w-full"
            />
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="md:w-10 w-8 text-[#212121]"
                fill={"none"}
              >
                <path
                  d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="#0083ff"
                />
                <path
                  d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="#0083ff"
                />
              </svg>
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="md:text-2xl text-lg font-bold placeholder:text-[#EEEEEE] bg-[#212121] px-4 py-2 rounded-lg focus:rounded-3xl text-center outline-none text-[#0083ff] transition-all duration-300 w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? ShowPasswordIcon : HidePasswordIcon}
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="cursor-pointer px-6 py-2 text-xl font-bold bg-[#0083ff] rounded-2xl w-full"
            >
              Submit
            </button>
          </div>
        </form>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setActiveTab("SignUp")}
            className="cursor-pointer text-[#212121] md:text-lg text-sm font-semibold mt-4 "
          >
            Don't have an account?{" "}
            <span className="text-[#0083ff] hover:text-[#212121] transition-all duration-300 hover:underline">
              Sign Up!
            </span>
          </button>
        </div>
      </div>
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
          text={"Account Found!!!"}
          buttonText={"let's Login!"}
          route={"/myphotos"}
        />
      )}
    </div>
  );
}
