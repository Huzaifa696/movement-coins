"use client";

import { Metadata } from "next";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Circle } from "lucide-react";
import { CoinListItem } from "components/launch-coin/coin-list-item";

export default function LaunchCoinPage() {
  const [coinTitle, setCoinTitle] = useState("");
  const [coinDescription, setCoinDescription] = useState("");
  const [nonprofitLink, setNonprofitLink] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      {/* Launch A Coin Section */}
      <section className="mb-20 mt-[100px]">
        <h1 className="text-5xl text-white font-bold text-center uppercase mb-4">Launch A Coin</h1>
        <p className="text-center text-xl text-white max-w-2xl mx-auto mb-12">
          All the coins you've submitted will appear here. it may take up to 24h for a coin to be
          analyzed and approved.
        </p>

        {/* Approved Coin */}
        <CoinListItem
          status="approved"
          coinTitle="SCRUKCKIT"
          nonprofitLink="ASL"
          aptAmount={100}
          xAptAmount={0}
        />

        {/* Pending Approval Coin */}
        <CoinListItem
          status="pending"
          coinTitle="SCRUKCKIT"
          nonprofitLink="ASL"
          aptAmount={100}
          xAptAmount={0}
        />

        {/* Not Approved Coin */}
        <CoinListItem
          status="rejected"
          coinTitle="SCRUKCKIT"
          nonprofitLink="ASL"
          aptAmount={100}
          xAptAmount={0}
        />
      </section>

      {/* Submit A New Coin Section */}
      <section className="mb-20 relative">
        <h1 className="text-5xl font-bold text-center uppercase text-white mb-4">
          Submit A New Coin
        </h1>
        <p className="text-center text-xl text-white max-w-4xl mx-auto mb-12">
          Insert the details of the coin you want to launch, we'll let you know as soon as it's
          approved.
        </p>

        {/* Balance and Cost */}
        <div className="flex justify-center gap-12 mb-8">
          <div className="flex  items-center">
            <span className="text-xs text-gray-400 mr-2">Your balance:</span>
            <Circle className="w-5 h-5 mr-1 text-gray-400" />
            <span className="font-medium text-white">100 APT</span>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-400 mr-2">Average launch cost:</span>
            <Circle className="w-5 h-5 mr-1 text-gray-400" />
            <span className="font-medium text-white">X APT</span>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Coin Title:"
              value={coinTitle}
              onChange={(e) => setCoinTitle(e.target.value)}
              className="w-full bg-transparent border border-gray-700 rounded-full px-6 py-3 focus:outline-none focus:border-gray-500 text-white"
            />
            <input
              type="text"
              placeholder="Coin Description:"
              value={coinDescription}
              onChange={(e) => setCoinDescription(e.target.value)}
              className="w-full bg-transparent border border-gray-700 rounded-full px-6 py-3 focus:outline-none focus:border-gray-500 text-white"
            />

            <div className="flex">
              <input
                type="text"
                placeholder="Coin Image:"
                className="flex-1 bg-transparent border border-gray-700 rounded-l-full px-6 py-3 focus:outline-none focus:border-gray-500 text-white"
                value={selectedFileName}
                readOnly
              />
              <button
                className="bg-black border border-gray-700 border-l-0 rounded-r-full px-6 py-3 uppercase text-sm font-medium text-white hover:bg-gray-900 transition-colors"
                onClick={handleUploadClick}
              >
                Upload
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <input
              type="text"
              placeholder="Nonprofit benefited - website link:"
              value={nonprofitLink}
              onChange={(e) => setNonprofitLink(e.target.value)}
              className="w-full bg-transparent border border-gray-700 rounded-full px-6 py-3 focus:outline-none focus:border-gray-500 text-white"
            />

            <div className="flex justify-center mt-8">
              <button className="bg-white text-black rounded-full px-12 py-2 font-medium uppercase">
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Gradient Background */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-r from-yellow-300 via-green-300 to-pink-300 opacity-30 blur-3xl -z-0"></div>
      </section>

      {/* Your Coins Section */}
      <section>
        <h2 className="text-2xl font-bold uppercase mb-4 text-white">Your Coins</h2>
        <p className="mb-8 text-xl text-white">
          We are analyzing your submission and making sure everything is aligned with our values, it
          may take up to 24h. See more details about your coin's performance in the{" "}
          <span className="underline text-white">pool page</span>.
        </p>

        {/* Coins Table - Grid Layout */}
        <div className="border border-gray-700 rounded-lg p-4">
          {/* Column Headers */}

          {/* Coin Rows */}
          <div className="space-y-3">
            {/* Coin 1 */}
            <div className="grid grid-cols-4 items-center border-b border-fuchsia-50 pb-3">
              <div className="text-sm text-white">#1</div>
              <div className="text-xs text-gray-400">03.14.2025 - 00:00 am</div>
              <div className="text-xs text-yellow-500">Pending approval</div>
              <div>-</div>
            </div>

            {/* Coin 2 */}
            <div className="grid grid-cols-4 items-center border-b border-fuchsia-50 pb-3">
              <div className="text-sm text-white">#2</div>
              <div className="text-xs text-gray-400">01.01.2025 - 01:35 am</div>
              <div className="text-xs text-purple-500">Active</div>
              <div>
                <button className="flex items-center text-sm text-white hover:underline">
                  COIN PAGE <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Coin 3 */}
            <div className="grid grid-cols-4 items-center border-b border-fuchsia-50 pb-3">
              <div className="text-sm text-white">#3</div>
              <div className="text-xs text-gray-400">01.01.2025 - 01:35 am</div>
              <div className="text-xs text-green-500">Approved</div>
              <div>
                <button className="flex items-center text-sm text-white hover:underline">
                  LAUNCH COIN <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Coin 4 */}
            <div className="grid grid-cols-4 items-center">
              <div className="text-sm text-white">#4</div>
              <div className="text-xs text-gray-400">01.12.2024 - 08:30 am</div>
              <div className="text-xs text-red">Inactive (not approved)</div>
              <div>-</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
