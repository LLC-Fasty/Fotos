"use client";
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";

export default function useUserData({ setIData, userId }) {
  useEffect(() => {
    const channel = supabase
      .channel("room2_c")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "liphimages" }, // Listen to all events (INSERT, DELETE, UPDATE)
        (payload) => {
          if (
            payload.new?.userId === userId ||
            payload.old?.userId === userId
          ) {
            // console.log("Change detected:", payload);
            const eventType = payload.eventType;

            if (eventType === "INSERT") {
              // console.log("New record inserted:", payload.new);
              setIData((prev) => [...prev, payload.new]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId, setIData]);

  return;
}
