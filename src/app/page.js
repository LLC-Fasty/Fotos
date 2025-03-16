"use client";
import SignIn from "@/components/SignIn";
import SignUp from "@/components/SignUp";
import React, { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("SignIn");
  return (
    <div>
      {activeTab === "SignIn" && <SignIn setActiveTab={setActiveTab} />}
      {activeTab === "SignUp" && <SignUp setActiveTab={setActiveTab} />}
    </div>
  );
}
