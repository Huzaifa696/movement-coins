"use client";
import styled from "styled-components";
import { StyledImage } from "components/image/styled";
import React, { useState } from "react";
import { type GridProps } from "components/pages/emojicoin/types";
import ProgressBar from "./ProgressBar";
import MarketCard from "./MarketCard";
import SwapComponentV2 from "components/pages/emojicoin/components/trade-emojicoin/SwapComponentV2";
import { type CoinsList } from "@prisma/client";
import Image from "next/image";

const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 4rem;
  position: relative;
  z-index: 15;
`;

const SideImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 2.5rem;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    width: 25%;
    margin-bottom: 0;
  }
`;

const MainContent = styled.div`
  width: 100%;
  padding: 0 2.5rem;
  z-index: 10;
  @media (min-width: 768px) {
    width: 50%;
  }
`;

const CoinDetailsBody = (props: GridProps & { coinDetails?: CoinsList | null }): JSX.Element => {
  const [showInfo, setShowInfo] = useState(false);

  const coinImage = props.coinDetails?.meta?.imageURL ?? "/images/coin/match1.png";
  const nonProfitImage = props.coinDetails?.meta?.nonProfitImageURL ?? "/images/coin/match1.png";
  const nonProfitName = props.coinDetails?.meta?.nonProfitName ?? "";

  return (
    <div className="container px-4">
      <ContentWrapper>
        <SideImageContainer>
          <div className="relative w-[205px] h-[205px] bg-white/10 rounded-full border-2 border-white shadow-[0px_17.5px_39.37px_0px_#00000026] backdrop-blur-[10.2px] z-[1]">
            <Image
              src={coinImage || ""}
              alt={""}
              width={160}
              height={160}
              className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-[160px] h-[160px] rounded-full border-2 border-white"
              priority
            />
          </div>
        </SideImageContainer>

        <MainContent>
          <SwapComponentV2
            coinImage={coinImage}
            emojicoin={props.data.symbol}
            marketAddress={props.data.marketAddress}
            marketEmojis={props.data.symbolEmojis}
            initNumSwaps={props.data.swaps.length}
          />
        </MainContent>

        <div className="w-full flex justify-center items-center px-10 sm-px-10 md:w-3/12 lg:w-3/12">
          <div className="relative w-[205px] h-[205px] bg-white/10 rounded-full border-2 border-white shadow-[0px_17.5px_39.37px_0px_#00000026] backdrop-blur-[10.2px] z-[1]">
            <Image
              src={nonProfitImage || ""}
              alt={""}
              width={160}
              height={160}
              className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-[160px] h-[160px] rounded-full border-2 border-white"
              priority
            />
          </div>
        </div>
        <div className="flex negative-margin justify-end mb-5 px-6 md:px-0 w-full z-1">
          <span onClick={() => setShowInfo(!showInfo)} className="cursor-pointer">
            <StyledImage src="/images/coin/info.png" />
          </span>
        </div>
        {showInfo ? (
          <div className="flex w-full flex-wrap px-6 md:px-0 items-center justify-end">
            <div className="box-show px-5 py-3 rounded-full max-content text-white">
              1% of every trade goes to {nonProfitName}
            </div>

            <a href="#" onClick={() => setShowInfo(false)}>
              <StyledImage src="/images/coin/close.png" />
            </a>
          </div>
        ) : (
          <div style={{ height: "55px" }} />
        )}

        <MarketCard />
        <ProgressBar title="CORAL REEFS SAVED" progress={66} />
        <ProgressBar title="EDUCATORS TRAINED" progress={31} variant="pink" />
      </ContentWrapper>
      <StyledImage className="w-full absolute bottom-match z-1" src="/images/home/match.png" />
    </div>
  );
};

export default CoinDetailsBody;
