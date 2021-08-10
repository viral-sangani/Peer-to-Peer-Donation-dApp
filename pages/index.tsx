import Head from "next/head";
import { useState } from "react";
import Body from "../components/Body";
import Header from "../components/Layout/Header";
import { UploadImage } from "../components/UploadImage";
import { useData } from "../contexts/DataContext";

export default function Home() {
  let [isOpen, setIsOpen] = useState(false);
  const { loading } = useData();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2">
      <Head>
        <title>Decentragram</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UploadImage isOpen={isOpen} closeModal={closeModal} />
      <Header />
      <div
        className="max-w-2xl w-full bg-blue-100 rounded-xl flex justify-center items-center py-2 mt-3 hover:bg-blue-200 cursor-pointer"
        onClick={openModal}
      >
        <span className="text-blue-500 font-bold text-lg">Upload Image</span>
      </div>
      {loading ? (
        <div className="font-bold text-gray-400 mt-36 text-4xl">Loading...</div>
      ) : (
        <Body />
      )}
    </div>
  );
}
