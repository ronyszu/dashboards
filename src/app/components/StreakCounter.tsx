"use client";

import React, { useState, useEffect } from "react";

// Helper: format number with leading zeros (e.g., 02:05:07)
function pad(num: number) {
  return num.toString().padStart(2, "0");
}

export default function StreakCounter() {
  const [streak, setStreak] = useState(0);
  const [lastClickDate, setLastClickDate] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(""); // Countdown to midnight
  const [isDisabled, setIsDisabled] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedStreak = localStorage.getItem("myStreak");
    const storedLastClick = localStorage.getItem("myLastClick");

    if (storedStreak) setStreak(parseInt(storedStreak, 10));
    if (storedLastClick) setLastClickDate(storedLastClick);
  }, []);

  // Check if we should reset streak or disable button, etc. whenever streak/lastClickDate changes
  useEffect(() => {
    if (!lastClickDate) return;

    const now = new Date();
    const last = new Date(lastClickDate);

    // Calculate difference in days between now and last click
    const diffInMs = now.getTime() - last.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // If user has gone 4+ days without clicking, reset streak
    if (diffInDays >= 4) {
      setStreak(0);
      setLastClickDate("");
      localStorage.setItem("myStreak", "0");
      localStorage.removeItem("myLastClick");
      setIsDisabled(false);
      return;
    }

    // If it's the same day, disable button
    // If it's a new day, enable button
    if (diffInDays === 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [lastClickDate]);

  // Handle click: increment streak, store date
  const handleClick = () => {
    if (isDisabled) return;

    const now = new Date();
    setStreak((prev) => prev + 1);
    setLastClickDate(now.toISOString());

    localStorage.setItem("myStreak", (streak + 1).toString());
    localStorage.setItem("myLastClick", now.toISOString());

    setIsDisabled(true);
  };

  // Countdown to midnight
  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      // Next midnight local time
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // tomorrow
        0, 0, 0, 0
      );
      const diff = midnight.getTime() - now.getTime(); // ms until midnight

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    }

    // Update immediately, then every second
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center bg-gray-100 p-6 rounded-md shadow-md w-full max-w-sm mx-auto">
      {/* Flame Icon + Streak */}
      <div className="flex flex-col items-center mb-4">
        <div className="text-6xl mb-2 text-orange-500">🔥</div>
        <div className="text-xl font-bold">
          {streak} day{streak === 1 ? "" : "s"} streak!
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`px-6 py-2 rounded-md font-semibold transition-colors ${
          isDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-600 cursor-pointer"
        } text-white`}
      >
        {isDisabled ? "Already Done for Today" : "Click to Increase Streak"}
      </button>

      {/* Info / Countdown */}
      <div className="mt-4 text-center text-sm text-gray-700">
        <p>
          Next reset in: <span className="font-bold">{timeLeft}</span>
        </p>
        <p className="mt-2">
          If you don't click for <span className="font-bold">4 days</span>,
          your streak resets!
        </p>
      </div>
    </div>
  );
}
