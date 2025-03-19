import React, { useMemo } from "react";
import { useMatchBreakpoints } from "hooks";
import { Text } from "components";
import { type TableRowDesktopProps } from "./types";
import { Emoji } from "utils/emoji";
import { FormattedNumber } from "components/FormattedNumber";
import { emoji } from "utils";
import {
  StyledPoolMainContent,
  StyledPoolRow,
  StyledPoolSubtext,
} from "components/pages/newPool/styled";
import Image from "next/image";

// prettier-ignore
export const getXPR = (x: number, tvlPerLpCoinGrowth: number) =>
  ((tvlPerLpCoinGrowth ** x) - 1) * 100;

export const formatXPR = (time: number, bigDailyTvl: number) => {
  if (bigDailyTvl === 0) {
    return <Emoji emojis={emoji("hourglass not done")} />;
  }
  const xprIn = getXPR(time, bigDailyTvl);

  return <FormattedNumber value={xprIn} style="fixed" suffix="%" decimals={4} />;
};

const TableRowDesktopNew: React.FC<TableRowDesktopProps> = ({ item, selected, onClick }) => {
  const { isMobile } = useMatchBreakpoints();
  const bigDailyTvl = Number(item.dailyTvlPerLPCoinGrowth);
  const dpr = useMemo(() => formatXPR(1, bigDailyTvl), [bigDailyTvl]);

  return (
    <StyledPoolRow onClick={onClick}>
      <StyledPoolMainContent>
        <div className="pool-icon">
          <img src={item?.coinMeta?.imageURL ?? "/images/pool/Aptos_White.png"} alt="Coin" />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <div>
            <div
              className="pool-details"
              style={{
                gridTemplateColumns: isMobile
                  ? "2fr 1.5fr 1.5fr"
                  : "2fr 1.5fr 1.5fr 1.5fr 1.5fr 1.5fr",
              }}
            >
              <div className="detail-item">
                <Text
                  fontSize={isMobile ? "13px" : "15px"}
                  fontWeight="700"
                  letterSpacing={"0.5px"}
                  lineHeight={"20px"}
                  color={"white"}
                  style={{ fontFamily: "Sifonn" }}
                >
                  {/* COIN TITLE */}
                  {item?.coinMeta?.title}
                </Text>
              </div>
              <div className="detail-item">
                <Text
                  fontSize={isMobile ? "10px" : "12px"}
                  fontWeight="500"
                  letterSpacing={"0.5px"}
                  lineHeight={"100%"}
                  color={"white"}
                  style={{ fontFamily: "Lora" }}
                >
                  {/* MARKET CAP */}
                  <FormattedNumber
                    value={item.state.cumulativeStats.quoteVolume}
                    suffix=" APT"
                    nominalize
                  />
                </Text>
              </div>
              <div className="detail-item">
                <Text
                  fontSize={isMobile ? "10px" : "12px"}
                  fontWeight="500"
                  letterSpacing={"0.5px"}
                  lineHeight={"100%"}
                  color={"white"}
                  style={{ fontFamily: "Lora" }}
                >
                  {/* DAILY VOLUME */}
                  <FormattedNumber value={item.dailyVolume} suffix="APT" nominalize />
                </Text>
              </div>
              {!isMobile && (
                <>
                  <div className="detail-item">
                    <Text
                      fontSize="12px"
                      fontWeight="500"
                      letterSpacing={"0.5px"}
                      lineHeight={"100%"}
                      color={"white"}
                      style={{ fontFamily: "Lora" }}
                    >
                      {/* ALL TIME VOLUME */}
                      <FormattedNumber
                        value={item.state.cumulativeStats.quoteVolume}
                        suffix=" APT"
                        nominalize
                      />
                    </Text>
                  </div>
                  <div className="detail-item">
                    <Text
                      fontSize="12px"
                      fontWeight="500"
                      letterSpacing={"0.5px"}
                      lineHeight={"100%"}
                      color={"white"}
                      style={{ fontFamily: "Lora" }}
                    >
                      {/* TVL */}
                      <FormattedNumber
                        value={item.state.cpammRealReserves.quote * 2n}
                        suffix=" APT"
                        nominalize
                      />
                    </Text>
                  </div>
                  <div className="detail-item">
                    <Text
                      fontSize="12px"
                      fontWeight="500"
                      letterSpacing={"0.5px"}
                      lineHeight={"100%"}
                      color={"white"}
                      style={{ fontFamily: "Lora" }}
                    >
                      {/* DPR */}
                      {dpr ?? ""}
                    </Text>
                  </div>
                </>
              )}
            </div>
          </div>
          <div
            style={{
              borderWidth: "1px",
              borderColor: "rgba(255, 255, 255, 0.3)",
              borderStyle: "solid",
              width: "100%",
              marginTop: "12px",
              marginBottom: "10px",
            }}
          />
          <div>
            <StyledPoolSubtext>
              {/* <span className="fire-icon">🔥</span> */}
              {/* <span className="hot-buy">+30.65%</span> */}
              <div className="badge-container">
                <span className="badge">1% TO {item?.coinMeta?.nonProfitName}</span>
                <Image src="/images/pool/info.svg" alt="info" width={15} height={15} />
              </div>
            </StyledPoolSubtext>
          </div>
        </div>
      </StyledPoolMainContent>
    </StyledPoolRow>
  );
};

export default TableRowDesktopNew;
