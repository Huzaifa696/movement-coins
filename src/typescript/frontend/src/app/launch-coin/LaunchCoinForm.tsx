"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { StyledImage } from "components/image/styled";
import { createCoin, type CreateCoinParams } from "app/actions/createCoin";
import { CoinStatus } from "@prisma/client";
import ButtonWithConnectWalletFallback from "components/header/wallet-button/ConnectWalletButton";
import { useAptos } from "context/wallet-context/AptosContextProvider";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { toCoinDecimalString } from "lib/utils/decimals";
import { ONE_APT_BIGINT } from "@sdk/const";

export default function LaunchCoinForm() {
  const router = useRouter();
  const [coinTitle, setCoinTitle] = useState("");
  const [coinDescription, setCoinDescription] = useState("");
  const [nonprofitLink, setNonprofitLink] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { account, aptBalance } = useAptos();

  const myBalance = Number(
    toCoinDecimalString(aptBalance, aptBalance / ONE_APT_BIGINT < 1 ? 6 : 4)
  );

  const resetForm = () => {
    setCoinTitle("");
    setCoinDescription("");
    setNonprofitLink("");
    setSelectedFileName("");
    fileInputRef.current!.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  async function uploadImageToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "movement-coin");

    const response = await fetch("https://api.cloudinary.com/v1_1/dmdtws06z/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.secure_url;
  }

  const handleSubmit = async () => {
    if (loading) return;
    if (!account?.address || account?.address === "") {
      toast.error("Please connect your wallet.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!coinTitle || coinTitle?.trim() === "") {
      toast.error("Please enter a coin title.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!coinDescription || coinDescription?.trim() === "") {
      toast.error("Please enter a coin description.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!fileInputRef.current?.files?.[0]) {
      toast.error("Please upload an image.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!nonprofitLink || nonprofitLink?.trim() === "") {
      toast.error("Please enter a nonprofit link.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    let imageURL = "";
    try {
      setLoading(true);
      imageURL = await uploadImageToCloudinary(fileInputRef.current.files[0]);
      if (!imageURL) {
        toast.error("Failed to upload image. Please try again.", {
          position: "top-center",
          autoClose: 5000,
        });
        return;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
      setLoading(false);
      return;
    }

    const coinData: CreateCoinParams = {
      data: {}, // Add any additional data needed
      emojiSlug: "pending-slug", // Replace with actual slug
      emojis: [], // Add any emojis if needed
      status: CoinStatus.PENDING,
      creatorAddress: account?.address,
      meta: {
        title: coinTitle?.trim(),
        description: coinDescription?.trim(),
        imageURL: imageURL,
        nonProfitName: "Example Nonprofit", // Replace with actual data
        nonProfitDescription: "Description of the nonprofit", // Replace with actual data
        nonProfitImageURL: imageURL, // Use the same image for simplicity
        nonProfitLink: nonprofitLink?.trim(),
      },
    };

    const result = await createCoin(coinData);
    
    if (result.success) {
      toast.success("Coin created successfully!", {
        position: "top-center",
        autoClose: 5000,
      });
      resetForm();
      router.refresh();
      setLoading(false);
      return;
    } else {
      toast.error(result?.error ?? "Failed to create coin.", {
        position: "top-center",
        autoClose: 5000,
      });
      setLoading(false);
    }
  };

  return (
    <section className="mb-20 relative">
      <h1 className="text-5xl font-bold text-center uppercase text-white mb-4 relative z-10">
        Submit A New Coin
      </h1>
      <p className="text-center text-xl text-white max-w-4xl mx-auto mb-12 z-10">
        {`Insert the details of the coin you want to launch, we&apos;ll let you know as soon as
        it&apos;s approved.`}
      </p>

      {/* Balance and Cost */}
      <div className="flex justify-center gap-12 mb-8 relative z-10 text-white">
        <div className="flex  items-center">
          <StyledImage className="mr-3 w-8 h-8" src="/images/coin/Aptos_White 2.png" />
          <div className="flex flex-col">
            <span className="text-xs mb-1 font-medium">Your balance:</span>
            <span className="font-medium text-white">{myBalance} APT</span>
          </div>
        </div>
        <div className="flex items-center">
          <div
            className="border border-white rounded-full p-2 px-3 mr-2"
            style={{ borderRadius: "100%", borderWidth: "2px" }}
          >
            <StyledImage src="/images/launch/dollar-symbol.png" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs mb-1 font-medium">Average launch cost:</span>
            <span className="font-medium text-white">1.01 APT (+ 1 APT)</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="space-y-4">
          {/* placeholder color */}
          <input
            type="text"
            placeholder="Coin Title:"
            value={coinTitle}
            onChange={(e) => setCoinTitle(e.target.value)}
            className="w-full bg-transparent border border-[#FEF8ED] rounded-full px-6 py-3 focus:outline-none focus:border-gray-500 text-white placeholder-[#FEF8ED]"
          />
          <input
            type="text"
            placeholder="Coin Description:"
            value={coinDescription}
            onChange={(e) => setCoinDescription(e.target.value)}
            className="w-full bg-transparent border border-[#FEF8ED] rounded-full px-6 py-3 focus:outline-none focus:border-gray-500 text-white placeholder-[#FEF8ED]"
          />

          <div className="flex">
            <input
              type="text"
              placeholder="Coin Image:"
              className="flex-1 bg-transparent border border-[#FEF8ED] rounded-l-full px-6 py-3 focus:outline-none focus:border-gray-500 text-white placeholder-[#FEF8ED]"
              value={selectedFileName}
              readOnly
            />
            <button
              className="bg-black border border-[#FEF8ED] border-l-0 rounded-r-full px-6 py-3 uppercase text-sm font-medium text-white hover:bg-gray-900 transition-colors"
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
            className="w-full bg-transparent border border-[#FEF8ED] rounded-full px-6 py-3 focus:outline-none focus:border-gray-500 text-white placeholder-white"
          />
          <div className="flex justify-center mt-8 ">
            <ButtonWithConnectWalletFallback>
              <button
                className="bg-white text-black rounded-full px-12 py-4 font-medium uppercase"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </ButtonWithConnectWalletFallback>
          </div>
        </div>
      </div>

      {/* Gradient Background */}
      <div className="absolute inset-0 flex justify-center items-center z-1">
        <Image
          src="/images/launch/launchCoinBg.png"
          alt="Gradient Background"
          layout="intrinsic"
          width={500}
          height={500}
          className="w-full h-full"
        />
      </div>
    </section>
  );
}
