"use client";
import React, { useMemo } from "react";
import { HeaderContainer, CoinTitle, CoinDescription, CoinDescriptionSpan } from "./styled";
import { useParams } from "next/navigation";
import { type CoinsList } from "@prisma/client";

const CoinDetailsHeader = ({ coinDetails }: { coinDetails: CoinsList | null }): JSX.Element => {
  const params = useParams();
  const name = (params?.market as string) ?? "BLACK_HEART";

  const formattedName = useMemo(() => {
    return name.replace(/[_-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  }, [name]);

  const nonProfitLink = coinDetails?.meta?.nonProfitLink ?? null;
  const nonProfitName = coinDetails?.meta?.nonProfitName ?? "";
  const nonProfitDescription = coinDetails?.meta?.nonProfitDescription ?? "";

  return (
    <HeaderContainer>
      <div className="mx-0 md:-mx-4 flex flex-wrap mt-16">
        <div className="w-full px-10 sm-px-10 md:w-12/12 lg:w-12/12">
          <div className="wow fadeInUp group" data-wow-delay=".1s">
            <CoinTitle>{formattedName}</CoinTitle>
            <CoinDescription>
              1% of every trade goes to{" "}
              <CoinDescriptionSpan
                className="text-third underline cursor-pointer z-9999"
                onClick={() => nonProfitLink && window.open(nonProfitLink, "_blank")}
              >
                {nonProfitName},
              </CoinDescriptionSpan>{" "}
              {nonProfitDescription}
            </CoinDescription>
          </div>
        </div>
      </div>
    </HeaderContainer>
  );
};

export default CoinDetailsHeader;
