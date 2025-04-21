import React from "react";
import { getAllCoins } from "app/actions/createCoin";
import TopCoinsList from "app/launch-coin/TopCoinsList";
import { type CoinsList } from "@prisma/client";

const ApprovalsPage = async () => {
  const coins = await getAllCoins();

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <TopCoinsList
        title="Approvals"
        description="All the coins users have submitted will appear here. you can approve or reject them."
        coins={(coins.data as CoinsList[]) ?? []}
        loading={false}
        showApproveAndRejectButtons={true}
      />
    </main>
  );
};

export default ApprovalsPage;
