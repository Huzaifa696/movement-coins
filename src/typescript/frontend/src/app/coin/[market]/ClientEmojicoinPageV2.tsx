"use client";

import React, { useEffect } from "react";
import { useMatchBreakpoints } from "hooks";
import { useEventStore } from "context/event-store-context";
import { useReliableSubscribe } from "@hooks/use-reliable-subscribe";
import { type BrokerEvent } from "@/broker/types";
import { type EmojicoinProps } from "components/pages/emojicoin/types";
import CoinDetailsHeader from "componentsV2/Coin/CoinDetailsHeader";
import CoinDetailsBody from "componentsV2/Coin/CoinDetailsBody";
import Chart from "components/Chart/Chart";
import { useParams } from "next/navigation";
import { formatEmojiNameThroughSlug } from "components/pages/home/components/emoji-table/utils";
// import Chart from "@/components/Chart/Chart";

const EVENT_TYPES: BrokerEvent[] = ["Chat", "PeriodicState", "Swap"];

const DUMMY_PRICE_HISTORY = [
  {
    timestamp: "2025-01-15 09:00",
    open: 0.000008,
    high: 0.000009,
    low: 0.000007,
    close: 0.000008,
    volume: 5000,
  },
  {
    timestamp: "2025-01-30 14:30",
    open: 0.000012,
    high: 0.000015,
    low: 0.000011,
    close: 0.000014,
    volume: 8500,
  },
  {
    timestamp: "2025-02-14 11:15",
    open: 0.000018,
    high: 0.000022,
    low: 0.000017,
    close: 0.000021,
    volume: 12000,
  },
  {
    timestamp: "2025-02-28 16:45",
    open: 0.000025,
    high: 0.000028,
    low: 0.000023,
    close: 0.000026,
    volume: 15500,
  },
  {
    timestamp: "2025-03-05 10:30",
    open: 0.000030,
    high: 0.000035,
    low: 0.000029,
    close: 0.000033,
    volume: 18000,
  },
  {
    timestamp: "2025-03-12 13:20",
    open: 0.000028,
    high: 0.000030,
    low: 0.000025,
    close: 0.000007,
    volume: 13500,
  },
  {
    timestamp: "2025-03-15 15:45",
    open: 0.000035,
    high: 0.000040,
    low: 0.000034,
    close: 0.000038,
    volume: 22000,
  },
  {
    timestamp: "2025-03-18 09:15",
    open: 0.000042,
    high: 0.000045,
    low: 0.000040,
    close: 0.000043,
    volume: 25000,
  },
  {
    timestamp: "2025-03-19 11:30",
    open: 0.000038,
    high: 0.000041,
    low: 0.000036,
    close: 0.000039,
    volume: 19500,
  },
  {
    timestamp: "2025-03-20 14:00",
    open: 0.000045,
    high: 0.000048,
    low: 0.000043,
    close: 0.000046,
    volume: 28000,
  },
  {
    timestamp: "2025-03-21 10:45",
    open: 0.000050,
    high: 0.000055,
    low: 0.000048,
    close: 0.000052,
    volume: 32000,
  },
  {
    timestamp: "2025-03-22 16:00",
    open: 0.000052,
    high: 0.000060,
    low: 0.000054,
    close: 0.00058,
    volume: 35000,
  },
  {
    timestamp: "2025-03-23 13:15",
    open: 0.00058,
    high: 0.000065,
    low: 0.000059,
    close: 0.000063,
    volume: 38000,
  },
  {
    timestamp: "2025-03-24 10:30",
    open: 0.000063,
    high: 0.000072,
    low: 0.000066,
    close: 0.000070,
    volume: 41000,
  }
];

interface PriceHistoryItem {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

type EmojicoinProps2 = EmojicoinProps & {
  data: {
    priceHistory?: PriceHistoryItem[];
  };
};

const ClientEmojicoinPageV2 = (props: EmojicoinProps2) => {
  const { isTablet, isMobile } = useMatchBreakpoints();
  const params = useParams();
  const name = (params?.market as string) ?? "BLACK_HEART";

  const loadMarketStateFromServer = useEventStore((s) => s.loadMarketStateFromServer);
  const loadEventsFromServer = useEventStore((s) => s.loadEventsFromServer);
  const setLatestBars = useEventStore((s) => s.setLatestBars);

  useEffect(() => {
    const { chats, swaps, state, marketView } = props.data;
    loadMarketStateFromServer([state]);
    loadEventsFromServer([...chats, ...swaps]);
    const latestBars = [];
    setLatestBars({ marketMetadata: state.market, latestBars });

    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [props.data]);

  useReliableSubscribe({ eventTypes: EVENT_TYPES });

  return (
    <>
      <div className="relative overflow-hidden pt-[120px] md:pt-[130px] lg:pt-[130px]">
        <CoinDetailsHeader coinDetails={props.data?.coinDetails ?? null} />
        <CoinDetailsBody data={props.data} coinDetails={props.data?.coinDetails ?? null} />
      </div>
      <div className="container mx-auto px-4 mt-16">
        <Chart
          title={formatEmojiNameThroughSlug(name ?? "")}
          data={
            DUMMY_PRICE_HISTORY?.map((item) => ({
              time: new Date(item.timestamp).getTime() / 1000,
              open: item.open,
              high: item.high,
              low: item.low,
              close: item.close,
              volume: item.volume,
            })) || []
          }
          height={400}
        />
      </div>
    </>
  );
};

export default ClientEmojicoinPageV2;
