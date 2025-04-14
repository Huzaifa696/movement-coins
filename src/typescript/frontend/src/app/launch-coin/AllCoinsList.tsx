import { CoinStatus, type CoinsList } from "@prisma/client";
import CoinRow from "./CoinRow";

export default function AllCoinsList({ coins, loading }: { coins: CoinsList[]; loading: boolean }) {
  const getLink = (coin: CoinsList) => {
    if (coin.status === CoinStatus.LAUNCHED) {
      return `/coin/${coin.titleSlug}`;
    }

    if (coin.status === CoinStatus.APPROVED) {
      return `/launch-coin`;
    }

    return undefined;
  };

  return (
    <section>
      <h2 className="text-2xl font-bold uppercase mb-4 text-white">Your Coins</h2>
      <p className="mb-8 text-xl text-white">
        We are analyzing your submission and making sure everything is aligned with our values, it
        may take up to 24h. See more details about your coin&apos;s performance in the{" "}
        <span className="underline text-white">pool page</span>.
      </p>

      {/* Coins Table - Grid Layout */}
      <div className="border border-gray-700 rounded-lg p-4">
        {/* Column Headers */}

        {/* Coin Rows */}
        <div className="space-y-3">
          {coins.map((coin, index) => (
            <CoinRow
              key={coin.id}
              id={index + 1}
              date={coin.createdAt.toLocaleString()}
              status={
                (coin.status?.toLowerCase() as "approved" | "pending" | "launched" | "rejected") ??
                "pending"
              }
              link={getLink(coin)}
            />
          ))}
          {!loading && coins?.length === 0 && (
            <div className="text-center text-white mt-4">No coins found</div>
          )}
          {/* <CoinRow id={1} date="03.14.2025 - 00:00 am" status="pending" />
          <CoinRow id={2} date="01.01.2025 - 01:35 am" status="launched" link="COIN PAGE" />
          <CoinRow id={3} date="01.01.2025 - 01:35 am" status="approved" link="LAUNCH COIN" />
          <CoinRow id={4} date="01.12.2024 - 08:30 am" status="rejected" /> */}
        </div>
      </div>
    </section>
  );
}
