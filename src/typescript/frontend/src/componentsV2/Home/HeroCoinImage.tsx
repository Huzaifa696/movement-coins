"use client";

import Image from "next/image";

type HeroCoinImageProps = {
  coinImage?: string;
  nonProfitImage?: string | null;
  coinTitle?: string;
  nonProfitTitle?: string;
};

const HeroCoinImage: React.FC<HeroCoinImageProps> = ({
  coinImage,
  nonProfitImage,
  coinTitle,
  nonProfitTitle,
}) => {
  return (
    <div className="relative w-fit">
      <div className="absolute top-0 left-0">
        <div className="relative w-[115px] h-[115px] bg-white/10 rounded-full border-2 border-white shadow-[0px_17.5px_39.37px_0px_#00000026] backdrop-blur-[10.2px] z-[1]">
          <Image
            src={nonProfitImage || ""}
            alt={nonProfitTitle || ""}
            width={82.71}
            height={82.71}
            className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-[82.71px] h-[82.71px] rounded-full border-2 border-white"
            priority
          />
        </div>
      </div>

      <div className="bg-white/10 w-[336px] h-[336px] rounded-full border-2 border-white shadow-[0px_24px_54px_0px_#00000026]"></div>
      <div className="absolute top-1/2 left-1/2 w-[252px] h-[252px] bg-white/10 rounded-full border-2 border-white shadow-[0px_24px_54px_0px_#00000026] transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-[164px] h-[164px] bg-white rounded-full border-2 border-white shadow-[0px_24px_54px_0px_#00000026] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <Image
          src={coinImage || ""}
          alt={coinTitle || ""}
          width={164}
          height={164}
          className="rounded-full"
          priority
        />
      </div>
    </div>
  );
};

export default HeroCoinImage;
