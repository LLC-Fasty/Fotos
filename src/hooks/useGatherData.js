"use client";
import { validLoginSession } from "@/services/authService";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function useGatherData({
  setLoading,
  setErrors,
  setShowSessionOver,
  setErrorPresent,
  setIData,
}) {
  const router = useRouter();
  const [uData, setUData] = useState({});
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const userlogInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        // console.log(token);
        if (!token) {
          localStorage.clear();
          router.push("/");
        }
        if (token) {
          const {
            success,
            situation,
            error,
            userData,
            userImageDetails,
            uname,
          } = await validLoginSession(token);

          if (error) {
            setErrors(error);
            setErrorPresent(true);
          }
          if (situation) {
            console.log(situation);
            setShowSessionOver(true);
          }
          if (success) {
            // console.log(userData);
            setUData(userData);
            // console.log(userImageDetails);
            setIData(userImageDetails);
            setUsername(uname);
            setUserId(userData.id);
          }
        }
      } catch (err) {
        setErrors(err.message);
        setErrorPresent(true);
      } finally {
        setLoading(false);
      }
    };
    userlogInfo();
  }, [router]);

  return {
    uData,
    username,
    userId,
    setUsername,
  };
}
