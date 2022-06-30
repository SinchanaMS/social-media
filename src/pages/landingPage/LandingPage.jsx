import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex h-[92vh] items-center justify-center bg-[url('assets/puzzle.webp')]">
      <div className="flex flex-col gap-2 rounded-md bg-white/90 py-10 px-6">
        <h1 className="text-3xl font-black sm:text-5xl">Find your people. </h1>
        <h1 className="text-3xl font-black sm:text-5xl">Build your </h1>
        <h1 className="w-fit bg-gradient-to-r from-pink-500 to-blue-900 bg-clip-text text-3xl font-black text-transparent sm:text-5xl">
          Puzzle.
        </h1>
        <Link
          to="/signup"
          className="text-md mt-4 w-fit rounded-md border-none bg-blue-700 py-2 px-6 text-gray-100 hover:brightness-90 sm:px-9 sm:py-3"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
