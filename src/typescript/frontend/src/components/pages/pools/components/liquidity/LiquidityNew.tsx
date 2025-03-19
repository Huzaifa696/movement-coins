"use client";

import React, { type PropsWithChildren, useEffect, useMemo, useState } from "react";
import { translationFunction } from "context/language-context";
import { Flex, Column, FlexGap } from "@containers";
import { Text, InputNumeric, Heading } from "components";
import { StyledAddLiquidityWrapperNew } from "./styled";
import { ProvideLiquidity, RemoveLiquidity } from "@/contract-apis/emojicoin-dot-fun";
import { AptosInputLabel } from "components/pages/emojicoin/components/trade-emojicoin/InputLabels";
import { useAptos } from "context/wallet-context/AptosContextProvider";
import { toActualCoinDecimals } from "lib/utils/decimals";
import { toCoinTypes } from "@sdk/markets/utils";
import ButtonWithConnectWalletFallback from "components/header/wallet-button/ConnectWalletButton";
import {
  useSimulateProvideLiquidity,
  useSimulateRemoveLiquidity,
} from "lib/hooks/queries/use-simulate-provide-liquidity";
import type { EntryFunctionTransactionBuilder } from "@sdk/emojicoin_dot_fun/payload-builders";
import { useSearchParams } from "next/navigation";
import { TypeTag } from "@aptos-labs/ts-sdk";
import { type PoolsData } from "../../ClientPoolsPage";
import { FormattedNumber } from "components/FormattedNumber";
import { useMatchBreakpoints } from "@hooks/index";
import ButtonNew from "components/button/ButtonNew";
import Image from "next/image";

type LiquidityProps = {
  market: PoolsData | undefined;
};

const InnerWrapper = ({
  children,
  id,
  className,
}: PropsWithChildren<{ id: string; className?: string }>) => (
  <div
    id={id}
    className={
      `flex justify-between items-center border-b border-white/20 ` +
      `h-[55px] px-4 py-2 ` +
      className
    }
  >
    {children}
  </div>
);

const grayLabel = `
  text-sm text-light-gray
`;

const inputAndOutputStyles = `block text-[16px] !font-normal outline-none w-full text-right text-white
  font-forma border-transparent !p-0  bg-transparent
`;

const LiquidityNew = ({ market }: LiquidityProps) => {
  const { t } = translationFunction();

  const { isMobile } = useMatchBreakpoints();

  const searchParams = useSearchParams();

  const presetInputAmount =
    searchParams.get("add") !== null ? searchParams.get("add") : searchParams.get("remove");
  const presetInputAmountIsValid =
    presetInputAmount !== null &&
    presetInputAmount !== "" &&
    !Number.isNaN(Number(presetInputAmount));

  const [liquidity, setLiquidity] = useState<bigint>(
    toActualCoinDecimals({
      num: searchParams.get("add") !== null && presetInputAmountIsValid ? presetInputAmount! : "1",
    })
  );

  const [lp, setLP] = useState<bigint>(
    toActualCoinDecimals({
      num:
        searchParams.get("remove") !== null && presetInputAmountIsValid ? presetInputAmount! : "1",
    })
  );

  const [direction, setDirection] = useState<"add" | "remove">(
    searchParams.get("remove") !== null ? "remove" : "add"
  );

  const {
    aptos,
    account,
    submit,
    aptBalance,
    refetchIfStale,
    setEmojicoinType,
    emojicoinBalance,
    emojicoinLPBalance,
  } = useAptos();

  const provideLiquidityResult = useSimulateProvideLiquidity({
    marketAddress: market?.market.marketAddress,
    quoteAmount: liquidity ?? 0,
  });

  const { emojicoin } = market ? toCoinTypes(market?.market.marketAddress) : { emojicoin: "" };

  const removeLiquidityResult = useSimulateRemoveLiquidity({
    marketAddress: market?.market.marketAddress,
    lpCoinAmount: lp ?? 0,
    typeTags: [emojicoin ?? ""],
  });

  const enoughApt =
    direction === "add" ? aptBalance !== undefined && aptBalance >= (liquidity ?? 0) : true;
  const enoughEmoji =
    direction === "add"
      ? emojicoinBalance !== undefined &&
        emojicoinBalance >= BigInt(provideLiquidityResult?.base_amount ?? 0)
      : true;
  const enoughEmojiLP =
    direction === "remove"
      ? emojicoinLPBalance !== undefined && emojicoinLPBalance >= (lp ?? 0)
      : true;

  useEffect(() => {
    if (emojicoin instanceof TypeTag) {
      setEmojicoinType(emojicoin);
    }
  }, [emojicoin, setEmojicoinType]);

  useEffect(() => {
    if (account) {
      refetchIfStale("apt");
    }
    if (market && account) {
      refetchIfStale("emojicoin");
      refetchIfStale("emojicoinLP");
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [market, account]);

  const isActionPossible =
    market !== undefined &&
    (direction === "add" ? liquidity !== 0n : lp !== 0n) &&
    enoughApt &&
    enoughEmoji &&
    enoughEmojiLP;

  const balanceLabel = useMemo(() => {
    return ` (${t("Balance")}: `;
  }, [t]);

  const aptInput = (
    <InnerWrapper id="apt" className="liquidity-input">
      <div className={grayLabel}>
        <span className="text-nowrap text-white">
          {direction === "add" ? t("You Deposit") : t("You Get")}:
        </span>
      </div>
      <div className="flex-1 ml-4">
        {direction === "add" ? (
          <InputNumeric
            className={inputAndOutputStyles}
            onUserInput={(e) => setLiquidity(e)}
            value={liquidity}
            decimals={8}
          />
        ) : (
          <FormattedNumber
            value={BigInt(removeLiquidityResult?.quote_amount ?? 0)}
            decimals={3}
            className={inputAndOutputStyles}
            nominalize
          />
        )}
      </div>
    </InnerWrapper>
  );

  const emojiInput = (
    <InnerWrapper id="emoji" className="liquidity-input">
      <div className={grayLabel}>
        <span className="text-nowrap text-white">
          {direction === "add" ? t("You Receive") : t("You Get")}:
        </span>
      </div>
      <div className="flex-1 ml-4">
        <FormattedNumber
          value={BigInt(
            (direction === "add"
              ? provideLiquidityResult?.base_amount
              : removeLiquidityResult?.base_amount) ?? 0
          )}
          decimals={3}
          className={inputAndOutputStyles + ` !bg-transparent leading-[32px] !text-white`}
          nominalize
        />
      </div>
    </InnerWrapper>
  );

  const emojiLPInput = (
    <InnerWrapper id="lp" className="liquidity-input">
      <div className={grayLabel}>
        <span className="text-nowrap text-white">
          {direction === "remove" ? t("You Deposit") : t("You Get")}:
        </span>
      </div>
      <div className="flex-1 ml-4">
        <FormattedNumber
          value={BigInt(provideLiquidityResult?.lp_coin_amount ?? 0)}
          decimals={3}
          className={inputAndOutputStyles + ` !bg-transparent leading-[32px] !text-white`}
          nominalize
        />
      </div>
    </InnerWrapper>
  );

  return (
    <Flex width="100%" justifyContent="center">
      <Column width="100%" maxWidth="414px" justifyContent="center">
        <Flex width="100%" justifyContent="space-between" alignItems="center" mb="10px">
          <Flex flexDirection="row">
            <FlexGap gap="10px" position="relative" justifyContent="left" alignItems="center">
              {/* <button
                onClick={() => setDirection(direction === "add" ? "remove" : "add")}
                className="absolute left-[-30px]"
              >
                <Arrows color="econiaBlue" />
              </button> */}

              {/* <Text
                textScale={isMobile ? "heading2" : "heading1"}
                textTransform="uppercase"
                className={isMobile ? "w-min" : ""}
              >
                {t(direction === "add" ? "Add liquidity" : "Remove liquidity")}
              </Text> */}

              {/* <Info>
                Liquidity providers receive a 0.25% fee from all trades, proportional to their pool
                share. Fees are continuously reinvested in the pool and can be claimed by
                withdrawing liquidity.
              </Info> */}
            </FlexGap>
          </Flex>
          <FlexGap flexDirection="row" gap="5px">
            {direction === "add" ? (
              <>
                {/* <EmojiPill
                  emoji={"waxing crescent moon"}
                  description="Deposit 25%"
                  onClick={() => {
                    setLiquidity(aptBalance / 4n);
                  }}
                />
                <EmojiPill
                  emoji={"first quarter moon"}
                  description="Deposit 50%"
                  onClick={() => {
                    setLiquidity(aptBalance / 2n);
                  }}
                />
                <EmojiPill
                  emoji={"full moon"}
                  description="Deposit 100%"
                  onClick={() => {
                    setLiquidity(aptBalance);
                  }}
                /> */}
              </>
            ) : (
              <>
                {/* <EmojiPill
                  emoji="nauseated face"
                  description="Withdraw 50%"
                  onClick={() => {
                    setLP(emojicoinLPBalance / 2n);
                  }}
                />
                <EmojiPill
                  emoji="face vomiting"
                  description="Withdraw 100%"
                  onClick={() => {
                    setLP(emojicoinLPBalance);
                  }}
                /> */}
              </>
            )}
          </FlexGap>
        </Flex>

        {direction === "add" ? (
          <StyledAddLiquidityWrapperNew>
            <FlexGap alignItems="center" gap="15px" ml="10px" mt="20px" mb="20px">
              <div className="token-icon">
                <img src="/images/pool/Aptos_White.png" alt="APT" />
              </div>
              <div>
                <Text fontWeight="700" fontSize="15px" color="white">
                  <FormattedNumber
                    value={aptBalance}
                    className={enoughApt ? "text-white" : "text-error"}
                    nominalize
                    decimals={3}
                  />
                </Text>
                <Text fontSize="10px" color="white" mt="2px" fontWeight="400">
                  Your balance
                </Text>
              </div>
            </FlexGap>
            {aptInput}
            {emojiInput}
            {emojiLPInput}
          </StyledAddLiquidityWrapperNew>
        ) : (
          <StyledAddLiquidityWrapperNew>
            {emojiLPInput}
            {aptInput}
            {emojiInput}
          </StyledAddLiquidityWrapperNew>
        )}

        <Flex
          width="100%"
          justifyContent="center"
          mb={{ _: "17px", tablet: "37px" }}
          position="relative"
        >
          <ButtonWithConnectWalletFallback>
            <ButtonNew
              scale="lg"
              disabled={!isActionPossible}
              isScramble={false}
              style={{
                cursor: isActionPossible ? "pointer" : "not-allowed",
                backgroundColor: "#FEF8ED",
                textAlign: "center",
                fontSize: "14px",
                fontWeight: "700",
                fontFamily: "Sifonn",
                color: "#000000",
                borderRadius: "50px",
                padding: "10px 20px",
                width: "100%",
                border: "1px solid #000000",
              }}
              onClick={async () => {
                if (!account) {
                  return;
                }
                const { emojicoin, emojicoinLP } = toCoinTypes(market!.market.marketAddress);
                let builderLambda: () => Promise<EntryFunctionTransactionBuilder>;
                if (direction === "add") {
                  builderLambda = () =>
                    ProvideLiquidity.builder({
                      aptosConfig: aptos.config,
                      provider: account.address,
                      marketAddress: market!.market.marketAddress,
                      quoteAmount: liquidity ?? 0,
                      typeTags: [emojicoin, emojicoinLP],
                      minLpCoinsOut: 1n,
                    });
                } else {
                  builderLambda = () =>
                    RemoveLiquidity.builder({
                      aptosConfig: aptos.config,
                      provider: account.address,
                      marketAddress: market!.market.marketAddress,
                      lpCoinAmount: lp,
                      typeTags: [emojicoin, emojicoinLP],
                      minQuoteOut: 1n,
                    });
                }
                await submit(builderLambda);
              }}
            >
              {t(direction === "add" ? "Add liquidity" : "Remove liquidity")}
            </ButtonNew>
          </ButtonWithConnectWalletFallback>
        </Flex>

        <Heading
          as="h2"
          scale="h2"
          style={{
            marginTop: "2rem",
            marginBottom: "1rem",
            fontSize: isMobile ? "20px" : "25px",
            color: "white",
            textTransform: "uppercase",
            fontWeight: "700",
            fontFamily: "Sifonn",
          }}
        >
          RESERVES
        </Heading>

        <StyledAddLiquidityWrapperNew>
          <div>
            <Flex
              p={{ _: "10px 12px 7px 10px", tablet: "18px 25px 7px 25px" }}
              justifyContent="space-between"
              alignItems="center"
            >
              {market ? (
                <AptosInputLabel
                  style={{
                    border: "1px solid white",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <span />
              )}

              <Text textScale={{ _: "bodySmall", tablet: "bodyLarge" }} textTransform="uppercase">
                {market ? (
                  <FormattedNumber
                    value={market.state.cpammRealReserves.quote}
                    nominalize
                    decimals={3}
                  />
                ) : (
                  "-"
                )}
              </Text>
            </Flex>

            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "white",
                margin: "10px 0px",
              }}
            />
          </div>

          <Flex
            p={{ _: "0px 12px 10px 12px", tablet: "0px 25px 18px 25px" }}
            justifyContent="space-between"
            alignItems="center"
          >
            {market?.coinMeta?.imageURL ? (
              <Image
                src={market?.coinMeta?.imageURL ?? ""}
                alt="emoji"
                width={45}
                height={45}
                style={{
                  border: "1px solid white",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <span />
            )}

            <Text textScale={{ _: "bodySmall", tablet: "bodyLarge" }} textTransform="uppercase">
              {market ? (
                <FormattedNumber
                  value={market.state.cpammRealReserves.base}
                  nominalize
                  decimals={3}
                />
              ) : (
                "-"
              )}
            </Text>
          </Flex>
        </StyledAddLiquidityWrapperNew>
      </Column>
    </Flex>
  );
};

export default LiquidityNew;
