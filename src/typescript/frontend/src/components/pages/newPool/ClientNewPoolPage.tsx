"use client";

import { FlexGap } from "@containers";
import { ErrorBoundary, ErrorBoundaryFallback, Heading, Text } from "components";
import { useEffect, useState } from "react";
import {
  StyledAddLiquidityCard,
  StyledAddLiquidityTitle,
  StyledContentWrapper,
  StyledForm,
  StyledHeader,
  StyledPoolTab,
  StyledPoolsContainer,
  StyledPoolsListCard,
  StyledReservesCard,
  StyledTabsContainer,
  StyledWrapper,
} from "./styled";
import { type PoolsData } from "../pools/ClientPoolsPage";
import { useMatchBreakpoints } from "hooks";
import { parseJSON } from "utils";
import type { SortByPageQueryParams } from "lib/queries/sorting/types";
import { MARKETS_PER_PAGE } from "lib/queries/sorting/const";
import { useAptos } from "context/wallet-context/AptosContextProvider";
import { useEmojiPicker } from "context/emoji-picker-context";
import { useSearchParams } from "next/navigation";
import { encodeEmojis, getEmojisInString, type SymbolEmoji } from "@sdk/emoji_data";
import { DEFAULT_POOLS_SORT_BY } from "@sdk/indexer-v2/queries/query-params";
import PoolsTableNew from "../pools/components/pools-table/PoolsTableNew";
import { getCoin } from "app/actions/createCoin";

const NewPoolContent = ({ initialData = [] }: { initialData?: PoolsData[] }) => {
  const mobileMenuOpen = false;
  const searchParams = useSearchParams();
  const poolParam = searchParams.get("pool");
  const [sortBy, setSortBy] = useState<SortByPageQueryParams>(DEFAULT_POOLS_SORT_BY);
  const [orderBy, setOrderBy] = useState<"desc" | "asc">("desc");
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(poolParam ? 0 : undefined);
  const [page, setPage] = useState<number>(1);
  const [markets, setMarkets] = useState<any[]>(initialData);
  const [allDataIsLoaded, setAllDataIsLoaded] = useState<boolean>(false);
  const [pools, setPools] = useState<"all" | "mypools">("all");
  const [realEmojis, setRealEmojis] = useState(getEmojisInString(poolParam ?? ""));
  const { emojis, setEmojis } = useEmojiPicker((state) => ({
    emojis: state.emojis,
    setEmojis: state.setEmojis,
  }));
  useEffect(() => {
    setEmojis(realEmojis);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const { account } = useAptos();

  useEffect(() => {
    setRealEmojis(emojis as SymbolEmoji[]);
  }, [emojis]);

  useEffect(() => {
    const poolsAPI = "/pools/api";
    const params = new URLSearchParams({
      sortby: sortBy,
      orderby: orderBy,
      page: page.toString(),
    });
    if (pools === "mypools" && account?.address) {
      params.set("account", account.address);
    }
    if (realEmojis.length) {
      params.set("searchBytes", encodeEmojis(realEmojis));
    }
    const url = `${poolsAPI}?${params.toString()}`;
    fetch(url)
      .then((res) => res.text())
      .then((txt) => parseJSON(txt) as PoolsData[])
      .then(async (data) => {
        // Fetch coin data for each pool
        const dataWithCoinInfo = await Promise.all(
          data.map(async (pool) => {
            const coin = await getCoin(pool?.market?.symbolData?.name);
            return {
              ...pool,
              coinMeta: coin?.data
                ? {
                    ...coin.data.meta,
                    titleSlug: coin.data.titleSlug,
                  }
                : null,
            };
          })
        );

        if (dataWithCoinInfo.length < MARKETS_PER_PAGE) {
          setAllDataIsLoaded(true);
        }
        setMarkets((markets) =>
          page === 1 ? [...dataWithCoinInfo] : [...markets, ...dataWithCoinInfo]
        );
      });
  }, [page, orderBy, sortBy, account, pools, realEmojis]);

  const { isMobile } = useMatchBreakpoints();

  return (
    <StyledWrapper>
      <StyledContentWrapper>
        {/* Page Header */}
        <StyledHeader>
          <Heading as="h1" scale="h1">
            POOLS
          </Heading>
        </StyledHeader>

        <FlexGap flexDirection="column" width="100%">
          <StyledPoolsContainer>
            {/* Left side - Add Liquidity */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: isMobile ? "100%" : "auto",
                marginTop: "20px",
              }}
            >
              <StyledAddLiquidityTitle>
                <Heading fontSize={isMobile ? "20px" : "25px"} fontWeight="700" fontFamily="Sifonn">
                  ADD LIQUIDITY
                </Heading>
                <Text
                  color="lightGray"
                  fontSize={isMobile ? "12px" : "15px"}
                  marginTop="10px"
                  style={{
                    fontFamily: "Lora",
                    lineHeight: "100%",
                    fontWeight: 400,
                    color: "#FEF8ED",
                  }}
                >
                  Add APT by depositing it or buying it{" "}
                  <span
                    style={{
                      fontWeight: 700,
                      textDecoration: "underline",
                      color: "#FEF8ED",
                    }}
                  >
                    here
                  </span>
                  .
                </Text>
              </StyledAddLiquidityTitle>

              <StyledAddLiquidityCard
                style={{
                  maxWidth: isMobile ? "100%" : "320px",
                }}
              >
                <StyledForm>
                  <FlexGap alignItems="center" gap="15px">
                    <div className="token-icon">
                      <img src="/images/pool/Aptos_White.png" alt="APT" />
                    </div>
                    <div>
                      <Text fontWeight="700" fontSize="15px" color="white">
                        100 APT
                      </Text>
                      <Text fontSize="10px" color="white" mt="2px" fontWeight="400">
                        Your balance
                      </Text>
                    </div>
                  </FlexGap>

                  <div className="info-item">
                    <Text color="white" fontSize="15px" fontWeight="400">
                      You Deposit: 1
                    </Text>
                    <div className="horizontal-line"></div>
                  </div>

                  <div className="info-item">
                    <Text color="white" fontSize="15px" fontWeight="400">
                      You Receive: 1
                    </Text>
                    <div className="horizontal-line"></div>
                  </div>

                  <div className="info-item">
                    <Text color="white" fontSize="15px" fontWeight="400">
                      You Get: 1
                    </Text>
                    <div className="horizontal-line"></div>
                  </div>

                  {/* {successMessage && (
                    <Text
                      color="lightGray"
                      mt="10px"
                      fontWeight="bold"
                      fontSize="12px"
                      style={{ color: "#44FF44" }}
                    >
                      {successMessage}
                    </Text>
                  )} */}

                  {/* {errorMessage && (
                    <Text
                      color="lightGray"
                      mt="10px"
                      fontWeight="bold"
                      fontSize="12px"
                      style={{ color: "#FF4444" }}
                    >
                      {errorMessage}
                    </Text>
                  )} */}

                  {/* <StyledAddLiquidityButton onClick={handleCreatePool} disabled={isCreating}>
                    {isCreating ? "Processing..." : "ADD LIQUIDITY"}
                  </StyledAddLiquidityButton> */}
                </StyledForm>
              </StyledAddLiquidityCard>

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

              <StyledReservesCard
                style={{
                  maxWidth: isMobile ? "100%" : "320px",
                }}
              >
                {/* The horizontal line is now built into the card styling */}
              </StyledReservesCard>
            </div>

            {/* Right side - Pools List */}
            {(!isMobile || (isMobile && !mobileMenuOpen)) && (
              <StyledPoolsListCard
                style={{
                  marginLeft: isMobile ? "0" : "15px",
                  marginTop: isMobile ? "2rem" : "0",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                {/* Tabs at the top */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    paddingLeft: isMobile ? "10px" : "20px",
                    width: "100%",
                  }}
                >
                  <StyledTabsContainer>
                    <StyledPoolTab
                      active={pools === "all"}
                      onClick={() => setPools("all")}
                      style={{
                        fontSize: isMobile ? "20px" : "25px",
                        fontFamily: "Sifonn",
                        fontWeight: 700,
                      }}
                    >
                      ALL POOLS
                    </StyledPoolTab>
                    <StyledPoolTab
                      active={pools === "mypools"}
                      onClick={() => setPools("mypools")}
                      style={{
                        fontSize: isMobile ? "20px" : "25px",
                        fontFamily: "Sifonn",
                        fontWeight: 700,
                        color: pools === "mypools" ? "white" : "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      MY POOLS
                    </StyledPoolTab>
                  </StyledTabsContainer>

                  <Text
                    fontFamily="Lora"
                    style={{
                      fontSize: isMobile ? "13px" : "15px",
                      lineHeight: "100%",
                      fontWeight: 400,
                      color: "#FEF8ED",
                      marginTop: "20px",
                      marginBottom: "25px",
                    }}
                  >
                    Trending pools today:
                    <span
                      style={{
                        fontWeight: 400,
                        textDecoration: "underline",
                        textDecorationStyle: "solid",
                        verticalAlign: "middle",
                      }}
                    >
                      {" "}
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        textDecoration: "underline",
                        textDecorationStyle: "solid",
                        verticalAlign: "middle",
                      }}
                    >
                      Coin One
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        verticalAlign: "middle",
                      }}
                    >
                      ,{" "}
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        textDecoration: "underline",
                        textDecorationStyle: "solid",
                        verticalAlign: "middle",
                      }}
                    >
                      Coin Two
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        verticalAlign: "middle",
                      }}
                    >
                      ,{" "}
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        textDecoration: "underline",
                        textDecorationStyle: "solid",
                        verticalAlign: "middle",
                      }}
                    >
                      Coin Three
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        verticalAlign: "middle",
                      }}
                    >
                      .
                    </span>
                  </Text>
                </div>

                {/* TABLE END  */}
                <PoolsTableNew
                  index={selectedIndex}
                  data={markets}
                  sortBy={(s) => {
                    setSortBy(s);
                    setPage(1);
                    setAllDataIsLoaded(false);
                  }}
                  orderBy={(s) => {
                    setOrderBy(s);
                    setPage(1);
                    setAllDataIsLoaded(false);
                  }}
                  onSelect={(index) => {
                    setSelectedIndex(index);
                  }}
                  onEnd={() => {
                    if (!allDataIsLoaded) {
                      setPage(page + 1);
                    }
                  }}
                />
              </StyledPoolsListCard>
            )}
          </StyledPoolsContainer>
        </FlexGap>
      </StyledContentWrapper>
    </StyledWrapper>
  );
};

// Wrap the component with ErrorBoundary
export const ClientNewPoolPage = (props: { initialData?: any[] }) => {
  return (
    <ErrorBoundary fallbackComponent={ErrorBoundaryFallback}>
      <NewPoolContent {...props} />
    </ErrorBoundary>
  );
};

export default ClientNewPoolPage;
