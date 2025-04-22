"use client";
import React, { useCallback, useEffect, useState } from "react";
import TopCoinsList from "./TopCoinsList";
import LaunchCoinForm from "./LaunchCoinForm";
import AllCoinsList from "./AllCoinsList";
import { type CoinsList } from "@prisma/client";
import { getMyCoins } from "app/actions/createCoin";
import { useAptos } from "context/wallet-context/AptosContextProvider";

export default function LaunchCoinPage() {
  const [coins, setCoins] = useState<CoinsList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { account } = useAptos();

  const fetchCoins = useCallback(async () => {
    if (!account?.address) return;
    setLoading(true);
    const coins = await getMyCoins(account?.address);
    if (coins?.success) {
      setCoins(coins.data as CoinsList[]);
    }
    setLoading(false);
  }, [account?.address]);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <TopCoinsList coins={coins} loading={loading} />
      <LaunchCoinForm />
      <AllCoinsList coins={coins} loading={loading} />
    </main>
  );
}
