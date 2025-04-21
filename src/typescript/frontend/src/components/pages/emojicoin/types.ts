import { type SymbolString } from "@/store/event/types";
import { type CoinsList } from "@prisma/client";
import { type SymbolEmoji } from "@sdk/emoji_data/types";
import { type AccountAddressString } from "@sdk/emojicoin_dot_fun";
import { type MarketMetadataModel, type DatabaseModels } from "@sdk/indexer-v2/types";
import { type Types } from "@sdk/types";

export interface WithVersion {
  version: number;
}
type DataProps = MarketMetadataModel & {
  symbol: SymbolString;
  swaps: Array<DatabaseModels["swap_events"]>;
  chats: Array<DatabaseModels["chat_events"]>;
  state: DatabaseModels["market_state"];
  marketView: Types["MarketView"];
  coinImage?: string;
  coinDetails?: CoinsList | null;
};

export interface EmojicoinProps {
  data: DataProps;
}

export interface MainInfoProps {
  data: Omit<DataProps, "swaps" | "chats">;
}

export interface GridProps {
  data: DataProps;
}

export interface ChatProps {
  data: Omit<DataProps, "swaps">;
}
export interface SwapComponentProps {
  emojicoin: string;
  marketAddress: AccountAddressString;
  marketEmojis: SymbolEmoji[];
  initNumSwaps: number;
  coinImage?: string;
}
export interface TradeHistoryProps {
  data: Omit<DataProps, "chats">;
}
