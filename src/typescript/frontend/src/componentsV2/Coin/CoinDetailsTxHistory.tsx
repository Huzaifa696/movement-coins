import React, { type PropsWithChildren, useEffect, useMemo, useRef } from "react";

import { getRankFromEvent } from "lib/utils/get-user-rank";
import { useEventStore } from "context/event-store-context";
import { memoizedSortedDedupedEvents } from "lib/utils/sort-events";
import { motion } from "framer-motion";
import { type SwapEventModel } from "@sdk/indexer-v2/types";
import { Emoji } from "utils/emoji";
import { type TradeHistoryProps } from "../../components/pages/emojicoin/types";
import { FormattedNumber } from "components/FormattedNumber";
import { toNominalPrice } from "@sdk/utils";

const HARD_LIMIT = 500;

const toTableItem = ({
  swap,
  transaction,
  shouldAnimateAsInsertion,
}: SwapEventModel & { shouldAnimateAsInsertion?: boolean }) => ({
  item: {
    ...getRankFromEvent(swap),
    apt: swap.quoteVolume,
    emoji: swap.baseVolume,
    date: new Date(Number(transaction.time / 1000n)),
    type: swap.isSell ? "sell" : "buy",
    priceQ64: swap.avgExecutionPriceQ64,
    swapper: swap.swapper,
    version: transaction.version,
  },
  shouldAnimateAsInsertion,
});

const TableHeader =
  "font-forma body-lg font-normal text-ec-blue position-sticky z-1 uppercase " +
  "text-center mt-[2px]";

const ThWrapper = ({ className, children }: { className: string } & PropsWithChildren) => (
  <th className={className + " " + TableHeader}>{children}</th>
);

const CoinDetailsTxHistory = (props: TradeHistoryProps) => {
  const swaps = useEventStore((s) => s.markets.get(props.data.symbol)?.swapEvents ?? []);

  const initialLoad = useRef(true);
  useEffect(() => {
    initialLoad.current = false;
    return () => {
      initialLoad.current = true;
    };
  }, []);

  // TODO: Add infinite scroll to this.
  // For now just don't render more than `HARD_LIMIT` chats.
  const sortedSwaps = useMemo(
    () =>
      memoizedSortedDedupedEvents({
        a: props.data.swaps,
        b: swaps,
        order: "desc",
        limit: HARD_LIMIT,
        canAnimateAsInsertion: !initialLoad.current,
      }).map(toTableItem),
    /* eslint-disable react-hooks/exhaustive-deps */
    [props.data.swaps.length, swaps.length]
  );

  return (
    <table className="relative flex flex-col table-fixed w-[40%] ">
      <thead className="relative w-full border-solid border-b-[1px] border-b-dark-gray border-[1px] border-solid border-white rounded-[20px] bg-[#D9D9D908]">
        <tr className={"flex w-full h-[33px]" + (sortedSwaps.length < 11 ? "" : " pr-[9px] ")}>
          <ThWrapper className="flex min-w-[70px] ml-[20px]">
            <span className="flex my-auto font-lora font-bold text-[10.2px] leading-[100%] tracking-[0%] uppercase text-[#FEF8ED]">
              Rank
            </span>
          </ThWrapper>
          <ThWrapper className="flex w-[25%]">
            <span className="flex my-auto font-lora font-bold text-[10.2px] leading-[100%] tracking-[0%] uppercase text-[#FEF8ED]">
              APT
            </span>
          </ThWrapper>
          <ThWrapper className="flex w-[35%] ">
            <span className="flex my-auto font-lora font-bold text-[10.2px] leading-[100%] tracking-[0%] uppercase text-[#FEF8ED]">
              DATE/TIME
            </span>
          </ThWrapper>
          <ThWrapper className="flex w-[40%]">
            <span className="flex my-auto font-lora font-bold text-[10.2px] leading-[100%] tracking-[0%] uppercase text-[#FEF8ED]">
              Price
            </span>
          </ThWrapper>
        </tr>
      </thead>
      <motion.tbody
        layoutScroll
        className="flex flex-col overflow-auto scrollbar-track w-full h-[570px] overflow-x-hidden"
      >
        {sortedSwaps.map(({ item, shouldAnimateAsInsertion }, index) => (
          <>
            <tr className={"flex w-full py-5 border-b border-[#FEF8ED80] border-solid" + (sortedSwaps.length < 11 ? "" : " pr-[9px] ")}>
              <ThWrapper className="flex min-w-[70px] ml-[20px]">
                <span className="flex my-auto font-lora font-bold text-[10.2px] leading-[100%] tracking-[0%] uppercase text-[#FEF8ED]">
                  #1
                </span>
              </ThWrapper>
              <ThWrapper className="flex w-[25%]">
                <span className="flex my-auto font-lora font-bold text-[10.2px] leading-[100%] tracking-[0%] uppercase text-[#FEF8ED]">
                  <FormattedNumber value={item.apt} className="ellipses" decimals={3} nominalize />
                </span>
              </ThWrapper>
              <ThWrapper className="flex w-[35%]">
              <span className="flex my-auto font-lora font-bold text-[10.2px] leading-[100%] tracking-[0%] uppercase text-[#FEF8ED]">
                  {item.date.toLocaleString(undefined, {
                    month: "2-digit" as const,
                    day: "2-digit" as const,
                    hour: "2-digit" as const,
                    minute: "2-digit" as const,
                    second: "2-digit" as const,
                  })}
                </span>
              </ThWrapper>
              <ThWrapper className="flex w-[40%]">
              <span className="flex my-auto font-lora font-bold text-[10.2px] leading-[100%] tracking-[0%] uppercase text-[#FEF8ED]">
                  <FormattedNumber
                    value={toNominalPrice(item.priceQ64)}
                    className="ellipses"
                    decimals={9}
                    style="fixed"
                  />
                </span>
              </ThWrapper>
            </tr>
          </>
          //   <TableRow
          //     // Note the key/index must be in reverse for the rows to animate correctly.
          //     key={sortedSwaps.length - index}
          //     index={sortedSwaps.length - index}
          //     item={item}
          //     showBorder={index !== sortedSwaps.length - 1 || sortedSwaps.length < 11}
          //     numSwapsDisplayed={sortedSwaps.length}
          //     shouldAnimateAsInsertion={shouldAnimateAsInsertion}
          //   ></TableRow>
        ))}
        {/* <tr className="absolute top-0 right-0 w-full z-[-1]">
          {Array.from({ length: 11 }).map((_, index) => (
            <motion.td
              key={`EMPTY_ROW::${index}`}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: sortedSwaps.length + 1 > index ? 0 : 1,
                transition: {
                  type: "just",
                  // Pretty much just guessing here with the `- 5` on the delay.
                  // We could coordinate it better with animation controls that are triggered as soon as the last row
                  // from the populated trades finishes animating but this is good enough.
                  delay: (index + sortedSwaps.length - 5) * 0.02,
                },
              }}
              className="flex min-h-[33px] border-b-dark-gray border-solid border-[1px] w-full"
            />
          ))}
        </tr> */}
      </motion.tbody>
    </table>
  );
};

export default CoinDetailsTxHistory;
