import { type CoinsList } from "@prisma/client";
import { ONE_APT_BIGINT } from "@sdk/const";
import { CoinListItem } from "components/launch-coin/coin-list-item";
import { useAptos } from "context/wallet-context/AptosContextProvider";
import { toCoinDecimalString } from "lib/utils/decimals";

export default function TopCoinsList({ coins }: { coins: CoinsList[]; loading: boolean }) {
  const { aptBalance } = useAptos();

  const myBalance = Number(
    toCoinDecimalString(aptBalance, aptBalance / ONE_APT_BIGINT < 1 ? 6 : 4)
  );

  return (
    <section className="mb-20 mt-[100px]">
      <h1 className="text-5xl text-white font-bold text-center uppercase mb-4">Launch A Coin</h1>
      <p className="text-center text-xl text-white max-w-2xl mx-auto mb-12">
        {`All the coins you've submitted will appear here. it may take up to 24h for a coin to be
        analyzed and approved.`}
      </p>
      {coins?.map((coin) => (
        <CoinListItem
          key={coin.id}
          status={(coin.status?.toLowerCase() as "approved" | "pending" | "rejected") ?? "pending"}
          coinTitle={coin.meta.title}
          nonprofitLink={coin.meta.nonProfitLink ?? ""}
          imageSrc={coin.meta.imageURL ?? ""}
          aptAmount={myBalance}
          xAptAmount={2}
        />
      ))}
    </section>
  );
}
