"use client";
import { type SymbolEmojiData } from "@sdk/emoji_data";
import { StyledImage } from "components/image/styled";
import { EmojiMarketPageLinkV2 } from "components/pages/home/components/table-card/LinkOrAnimationTriggerV2";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "router/routes";

interface CoinCardProps {
  id: number;
  title?: string;
  time: number;
  value: bigint;
  change: string;
  description?: string;
  emojis: Array<SymbolEmojiData>;
  imageURL?: string;
  titleSlug: string;
  nonProfit?: string;
}

const formatTimeAgo = (timestamp: number): string => {
  try {
    const now = Date.now();
    const diff = now - timestamp;

    // Convert to different units
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years} y`;
    } else if (days > 0) {
      return `${days} d`;
    } else if (hours > 0) {
      return `${hours} hr`;
    } else if (minutes > 0) {
      return `${minutes} min`;
    } else {
      return "1 min";
    }
  } catch (error) {
    console.error("Error formatting time ago:", error);
    return "Invalid timestamp";
  }
};

const formatValue = (value: bigint): string => {
  if (value >= 1_000_000_000) {
    return `${(Number(value) / 1_000_000_000).toFixed(2)}B APT`;
  } else if (value >= 1_000_000) {
    return `${(Number(value) / 1_000_000).toFixed(2)}M APT`;
  } else if (value >= 1_000) {
    return `${(Number(value) / 1_000).toFixed(2)}K APT`;
  } else if (value >= 1) {
    return value.toString() + " APT";
  } else {
    // For numbers less than 1, show up to 4 significant digits
    return value.toString() + " APT";
  }
};

const CoinCard: React.FC<CoinCardProps> = ({
  emojis,
  id,
  title,
  time,
  value,
  change,
  description,
  imageURL,
  titleSlug,
  nonProfit,
}) => {
  const timeAgo = formatTimeAgo(time);
  const formattedValue = formatValue(value ?? 0n);

  return (
    <Link href={`${ROUTES.coin}/${titleSlug}`}>
      <div className="cursor-pointer p-5 flex-box items-center rounded-full round w-full bg-white/[0.04] shadow-[0px_19.85px_44.66px_0px_#00000026] border-2 border-[#FFFFFF80] border-solid">
        <div className="relative">
          <div className=" relative mr-10 w-[130px] h-[130px] rounded-full border-2 border-white/50 bg-white/[0.04] shadow-[0px_19.85px_44.66px_0px_#00000026] backdrop-blur-[11.58px] border-solid">
            <Image
              src={imageURL || ""}
              alt={titleSlug || ""}
              width={94}
              height={94}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94px] h-[94px] rounded-full border-[1.5px] border-white/50 shadow-[0px_19.85px_44.66px_0px_#00000026] border-solid object-cover"
              priority
            />
            <div className="absolute bottom-0 -right-[24px] w-[78px] h-[78px] rounded-full border-2 border-white/50 bg-white/[0.04] shadow-[0px_19.85px_44.66px_0px_#00000026] backdrop-blur-[11.58px] border-solid">
              <Image
                src={nonProfit || ""}
                alt={titleSlug || ""}
                width={56}
                height={56}
                className="w-[56px] h-[56px] rounded-full border-[1.5px] border-white/50 object-cover border-solid absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                priority
              />
            </div>
          </div>
        </div>
        <div className=" w-[51%]">
          <div className="flex mb-5">
            <div className="mr-3" style={{ width: "20px" }}>
              <StyledImage src="/images/home/fire.png" />
            </div>
            <div className="font-medium flex items-center justify-center text-sm px-2 py-0 border-green text-green rounded-full mr-3">
              {change}
            </div>
          </div>
          <h1 className="mb-3 main-title-sm text-white dark:text-white">{title ?? "-"}</h1>
          <p className="text-white font-lora font-normal text-[16px] leading-[18.19px] tracking-[0%]">
            {description ?? "No description available"}
          </p>
        </div>
        <div className="w-[150px]">
          <h5 className="main-title-sm-2 text-white dark:text-white">{timeAgo}</h5>
        </div>
        <div>
          <h5 className="main-title-sm-2 text-white dark:text-white">{formattedValue}</h5>
        </div>
      </div>
    </Link>
  );
};

export default CoinCard;
