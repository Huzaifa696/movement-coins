"use client";

import { FlexGap } from "@containers";
import { ErrorBoundary, ErrorBoundaryFallback, Heading, Text } from "components";
import { useEmojiPicker } from "context/emoji-picker-context";
import { useAptos } from "context/wallet-context/AptosContextProvider";
import { useMatchBreakpoints } from "hooks";
import { useEffect, useState } from "react";
import {
  StyledAddLiquidityButton,
  StyledAddLiquidityCard,
  StyledAddLiquidityTitle,
  StyledContentWrapper,
  StyledFilterRow,
  StyledForm,
  StyledHeader,
  StyledPoolItem,
  StyledPoolMainContent,
  StyledPoolRow,
  StyledPoolSubtext,
  StyledPoolTab,
  StyledPoolsContainer,
  StyledPoolsGrid,
  StyledPoolsListCard,
  StyledReservesCard,
  StyledTabsContainer,
  StyledWrapper
} from "./styled";

// Define the data type that will be passed from the server component
export type NewPoolData = {
  // Add necessary properties here
};

// Update the mock data to match the image exactly
const EXACT_MOCK_POOLS = [
  {
    id: 1,
    name: "COIN TITLE",
    mktCap: "$675,4534.99",
    vol24h: "$675,4534.99",
    allTime: "$1,000,000",
    tvl: "$1,000,000",
    dpr: "$1,000,000",
  },
  {
    id: 2,
    name: "COIN TITLE",
    mktCap: "$675,4534.99",
    vol24h: "$675,4534.99", 
    allTime: "$1,000,000",
    tvl: "$1,000,000",
    dpr: "$1,000,000",
  },
  {
    id: 3,
    name: "COIN TITLE",
    mktCap: "$675,4534.99",
    vol24h: "$675,4534.99",
    allTime: "$1,000,000",
    tvl: "$1,000,000",
    dpr: "$1,000,000",
  },
  {
    id: 4,
    name: "COIN TITLE",
    mktCap: "$675,4534.99",
    vol24h: "$675,4534.99",
    allTime: "$1,000,000",
    tvl: "$1,000,000",
    dpr: "$1,000,000",
  },
  {
    id: 5,
    name: "COIN TITLE",
    mktCap: "$675,4534.99",
    vol24h: "$675,4534.99",
    allTime: "$1,000,000",
    tvl: "$1,000,000",
    dpr: "$1,000,000",
  },
];

const NewPoolContent = ({ initialData = {} }: { initialData?: NewPoolData }) => {
  const { isMobile, isTablet, isDesktop } = useMatchBreakpoints();
  const { account } = useAptos();
  const { emojis, setEmojis } = useEmojiPicker((state) => ({
    emojis: state.emojis,
    setEmojis: state.setEmojis,
  }));

  // State management for the pools page
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [assetAmount, setAssetAmount] = useState<string>("");
  const [reserveAmount, setReserveAmount] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use connected state based on account existence
  const connected = !!account;

  // Use the exact mock data to match the image
  const [filteredPools, setFilteredPools] = useState(EXACT_MOCK_POOLS);

  // Filter pools based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredPools(EXACT_MOCK_POOLS);
    } else {
      // In a real app, this would filter based on user's connected wallet
      setFilteredPools(connected ? EXACT_MOCK_POOLS.filter((pool, index) => index < 3) : []);
    }
  }, [activeTab, connected]);

  const handleCreatePool = async () => {
    if (!connected) {
      setErrorMessage("Please connect your wallet to add liquidity.");
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    if (!assetAmount || !reserveAmount) {
      setErrorMessage("Please enter both asset and reserve amounts.");
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    setErrorMessage(null);
    setIsCreating(true);

    try {
      // Simulate API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccessMessage(`Successfully added ${assetAmount} to the pool!`);
      setTimeout(() => setSuccessMessage(null), 5000);

      // Reset form
      setAssetAmount("");
      setReserveAmount("");
    } catch (error) {
      console.error("Error creating pool:", error);
      setErrorMessage("Failed to add liquidity. Please try again.");
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <StyledWrapper>
      {/* Top Navigation */}
      

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
            <div style={{ 
              display: "flex", 
              flexDirection: "column",
              width: isMobile ? "100%" : "auto"
            }}>
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

              <StyledAddLiquidityCard style={{
                maxWidth: isMobile ? "100%" : "320px"
              }}>
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

                  {successMessage && (
                    <Text
                      color="lightGray"
                      mt="10px"
                      fontWeight="bold"
                      fontSize="12px"
                      style={{ color: "#44FF44" }}
                    >
                      {successMessage}
                    </Text>
                  )}

                  {errorMessage && (
                    <Text
                      color="lightGray"
                      mt="10px"
                      fontWeight="bold"
                      fontSize="12px"
                      style={{ color: "#FF4444" }}
                    >
                      {errorMessage}
                    </Text>
                  )}

                  <StyledAddLiquidityButton onClick={handleCreatePool} disabled={isCreating}>
                    {isCreating ? "Processing..." : "ADD LIQUIDITY"}
                  </StyledAddLiquidityButton>
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

              <StyledReservesCard style={{
                maxWidth: isMobile ? "100%" : "320px"
              }}>
                {/* The horizontal line is now built into the card styling */}
              </StyledReservesCard>
            </div>

            {/* Right side - Pools List */}
            {(!isMobile || (isMobile && !mobileMenuOpen)) && (
              <StyledPoolsListCard style={{
                marginLeft: isMobile ? "0" : "15px",
                marginTop: isMobile ? "2rem" : "0",
                width: isMobile ? "100%" : "auto"
              }}>
                {/* Tabs at the top */}
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  paddingLeft: isMobile ? "10px" : "20px",
                  width: "100%"
                }}>
                  <StyledTabsContainer>
                    <StyledPoolTab
                      active={activeTab === "all"}
                      onClick={() => setActiveTab("all")}
                      style={{ 
                        fontSize: isMobile ? "20px" : "25px", 
                        fontFamily: "Sifonn", 
                        fontWeight: 700
                      }}
                    >
                      ALL POOLS
                    </StyledPoolTab>
                    <StyledPoolTab
                      active={activeTab === "my"}
                      onClick={() => setActiveTab("my")}
                      style={{
                        fontSize: isMobile ? "20px" : "25px",
                        fontFamily: "Sifonn",
                        fontWeight: 700,
                        color: activeTab === "my" ? "white" : "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      MY POOLS
                    </StyledPoolTab>
                  </StyledTabsContainer>

                  <Text
                    style={{
                      fontFamily: "Lora",
                      fontSize: isMobile ? "13px" : "15px",
                      lineHeight: "100%",
                      fontWeight: 400,
                      color: "#FEF8ED",
                      marginTop: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    Trending pools today:
                    <span
                      style={{
                        fontFamily: "Lora",
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
                        fontFamily: "Lora",
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
                        fontFamily: "Lora",
                        fontWeight: 700,
                        verticalAlign: "middle",
                      }}
                    >
                      ,{" "}
                    </span>
                    <span
                      style={{
                        fontFamily: "Lora",
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
                        fontFamily: "Lora",
                        fontWeight: 700,
                        verticalAlign: "middle",
                      }}
                    >
                      ,{" "}
                    </span>
                    <span
                      style={{
                        fontFamily: "Lora",
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
                        fontFamily: "Lora",
                        fontWeight: 700,
                        verticalAlign: "middle",
                      }}
                    >
                      .
                    </span>
                  </Text>
                </div>

                <StyledFilterRow>
                  <StyledPoolItem>
                    <Text
                      color="white"
                      fontWeight="700"
                      textTransform="uppercase"
                      fontSize={isMobile ? "9px" : "11px"}
                      style={{ fontFamily: "Lora", letterSpacing: "1px" }}
                    >
                      NAME{" "}
                      <span style={{ fontSize: "8px", marginLeft: "4px", verticalAlign: "middle" }}>
                        ▼
                      </span>
                    </Text>
                  </StyledPoolItem>
                  <StyledPoolItem>
                    <Text
                      color="white"
                      fontWeight="700"
                      textTransform="uppercase"
                      fontSize={isMobile ? "9px" : "11px"}
                      style={{ fontFamily: "Lora", letterSpacing: "1px" }}
                    >
                      MKT CAP{" "}
                      <span style={{ fontSize: "8px", marginLeft: "4px", verticalAlign: "middle" }}>
                        ▼
                      </span>
                    </Text>
                  </StyledPoolItem>
                  <StyledPoolItem>
                    <Text
                      color="white"
                      fontWeight="700"
                      textTransform="uppercase"
                      fontSize={isMobile ? "9px" : "11px"}
                      style={{ fontFamily: "Lora", letterSpacing: "1px" }}
                    >
                      24 VOL{" "}
                      <span style={{ fontSize: "8px", marginLeft: "4px", verticalAlign: "middle" }}>
                        ▼
                      </span>
                    </Text>
                  </StyledPoolItem>
                  {!isMobile && (
                    <>
                      <StyledPoolItem>
                        <Text
                          color="white"
                          fontWeight="700"
                          textTransform="uppercase"
                          fontSize="11px"
                          style={{ fontFamily: "Lora", letterSpacing: "1px" }}
                        >
                          ALL TIME{" "}
                          <span style={{ fontSize: "8px", marginLeft: "4px", verticalAlign: "middle" }}>
                            ▼
                          </span>
                        </Text>
                      </StyledPoolItem>
                      <StyledPoolItem>
                        <Text
                          color="white"
                          fontWeight="700"
                          textTransform="uppercase"
                          fontSize="11px"
                          style={{ fontFamily: "Lora", letterSpacing: "1px" }}
                        >
                          TVL{" "}
                          <span style={{ fontSize: "8px", marginLeft: "4px", verticalAlign: "middle" }}>
                            ▼
                          </span>
                        </Text>
                      </StyledPoolItem>
                      <StyledPoolItem>
                        <Text
                          color="white"
                          fontWeight="700"
                          textTransform="uppercase"
                          fontSize="11px"
                          style={{ fontFamily: "Lora", letterSpacing: "1px" }}
                        >
                          DPR{" "}
                          <span style={{ fontSize: "8px", marginLeft: "4px", verticalAlign: "middle" }}>
                            ▼
                          </span>
                        </Text>
                      </StyledPoolItem>
                    </>
                  )}
                </StyledFilterRow>

                <StyledPoolsGrid>
                  {filteredPools.length > 0 ? (
                    filteredPools.slice(0, isMobile ? 3 : filteredPools.length).map((pool, index) => (
                      <StyledPoolRow key={pool.id}>
                        <StyledPoolMainContent>
                          <div className="pool-icon">
                            <img src="/images/pool/Aptos_White.png" alt="Coin"/>
                            {index === 0 && <div className="star-indicator"></div>}
                          </div>
                          <div style={{ 
                            display: "flex", 
                            flexDirection: "column", 
                            gap: "10px", 
                            width: "100%",
                            overflow: "hidden"
                          }}>
                            <div>
                              <div className="pool-details" style={{
                                gridTemplateColumns: isMobile 
                                  ? "2fr 1.5fr 1.5fr" 
                                  : "2fr 1.5fr 1.5fr 1.5fr 1.5fr 1.5fr"
                              }}>
                                <div className="detail-item">
                                  <Text
                                    fontSize={isMobile ? "13px" : "15px"}
                                    fontWeight="700"
                                    letterSpacing={"0.5px"}
                                    lineHeight={"20px"}
                                    color={"white"}
                                    style={{ fontFamily: "Sifonn" }}
                                  >
                                    COIN TITLE
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
                                    {pool.mktCap}
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
                                    {pool.vol24h}
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
                                        {pool.allTime}
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
                                        {pool.tvl}
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
                                        {pool.dpr}
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
                                <span className="fire-icon">🔥</span>
                                <span className="hot-buy">+30.65%</span>
                                <div className="badge-container">
                                  <span className="badge">1% TO GREENPEACE</span>
                                  <span className="info-circle">i</span>
                                </div>
                              </StyledPoolSubtext>
                            </div>
                          </div>
                        </StyledPoolMainContent>
                      </StyledPoolRow>
                    ))
                  ) : (
                    <Text color="lightGray" textAlign="center" py="2rem" fontSize="14px">
                      {activeTab === "my"
                        ? "Connect your wallet to see your pools"
                        : "No pools available at the moment"}
                    </Text>
                  )}
                </StyledPoolsGrid>
              </StyledPoolsListCard>
            )}
          </StyledPoolsContainer>
        </FlexGap>
      </StyledContentWrapper>
    </StyledWrapper>
  );
};

// Wrap the component with ErrorBoundary
export const ClientNewPoolPage = (props: { initialData?: NewPoolData }) => {
  return (
    <ErrorBoundary fallbackComponent={ErrorBoundaryFallback}>
      <NewPoolContent {...props} />
    </ErrorBoundary>
  );
};

export default ClientNewPoolPage;
