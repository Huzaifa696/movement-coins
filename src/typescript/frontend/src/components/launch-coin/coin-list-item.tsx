import Image from "next/image";
import { Circle } from "lucide-react";
import { StyledImage } from "components/image/styled";

interface CoinListItemProps {
  status: "approved" | "pending" | "rejected";
  coinTitle: string;
  nonprofitLink: string;
  aptAmount: number;
  xAptAmount: number;
  imageSrc?: string;
}

export function CoinListItem({
  status,
  coinTitle,
  nonprofitLink,
  aptAmount,
  xAptAmount,
  imageSrc = "/images/coin/coin-avatar.png",
}: CoinListItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-[#7BC67E]";
      case "pending":
        return "text-yellow-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "pending":
        return "Pending approval";
      case "rejected":
        return "Not approved";
      default:
        return "Unknown";
    }
  };

  const getActionButton = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <button className="bg-white text-black rounded-full w-[140px] h-[140px] font-bold text-2xl hover:bg-gray-50 transition-colors">
            LAUNCH
          </button>
        );
      case "pending":
        return (
          <button
            className="bg-gray-200 text-gray-500 rounded-full w-[140px] h-[140px] font-bold text-2xl"
            disabled
          >
            LAUNCH
          </button>
        );
      case "rejected":
        return (
          <button className="bg-white text-black rounded-full w-[140px] h-[140px] font-bold text-2xl hover:bg-gray-50 transition-colors">
            TRY AGAIN
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-xl rounded-full border border-white mb-4">
      <div className="flex items-center gap-8">
        <div className="relative">
          <div className="w-[140px] h-[140px] rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 opacity-80">
              <Image
                src={imageSrc}
                alt={`${coinTitle} coin image`}
                width={140}
                height={140}
                className="object-cover w-full h-full mix-blend-overlay"
              />
            </div>
          </div>
          <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg">
            <div className="text-black font-bold text-sm">V.</div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className={`text-sm font-medium ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </div>
          <div className="text-xl font-bold text-white">
            <span className="uppercase">{coinTitle}</span>
          </div>
          <div className="text-sm text-white/80">
            Nonprofit benefited - website link:{" "}
            <a href={nonprofitLink} className="underline hover:text-white">
              {nonprofitLink}
            </a>
          </div>

          <div className="flex items-center gap-6 mt-2">
            <div className="flex items-center">
              <StyledImage className="mr-3 w-5 h-5" src="/images/coin/Aptos_White 2.png" />
              <span className="text-sm text-white/90 font-medium">{aptAmount} APT</span>
            </div>
            <div className="flex items-center">
              <Circle className="w-5 h-5 mr-2 text-white/50" />
              <span className="text-sm text-white/90 font-medium">{xAptAmount} X APT</span>
            </div>
          </div>
        </div>
      </div>

      {getActionButton(status)}
    </div>
  );
}
