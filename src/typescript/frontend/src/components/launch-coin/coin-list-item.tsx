"use client";
import Image from "next/image";
import { StyledImage } from "components/image/styled";
import { useRegisterMarket } from "components/pages/launch-emojicoin/hooks/use-register-market";
import ButtonWithConnectWalletFallback from "components/header/wallet-button/ConnectWalletButton";
import { useMemo } from "react";
import { MARKET_REGISTRATION_DEPOSIT } from "@sdk/const";
import { useAptos } from "context/wallet-context/AptosContextProvider";
import { useCallback, useState } from "react";
import { updateCoin } from "app/actions/createCoin";
import { CoinStatus } from "@prisma/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface CoinListItemProps {
  coinId: string;
  status: "approved" | "pending" | "rejected";
  coinTitle: string;
  nonprofitLink: string;
  aptAmount: number;
  xAptAmount: number;
  imageSrc?: string;
  meta: object;
  id: string;
  showApproveAndRejectButtons?: boolean;
}

const CircularButton = ({
  children,
  onClick,
  disabled,
  loading = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled: boolean;
  loading?: boolean;
}) => {
  return (
    <button
      className="bg-white text-black rounded-full w-[140px] h-[140px] font-bold text-2xl hover:bg-gray-50 transition-colors"
      onClick={() => onClick?.()}
      disabled={disabled || loading}
    >
      {loading ? (
        <p className="font-bold text-xl hover:bg-gray-50 transition-colors">Updating..</p>
      ) : (
        children
      )}
    </button>
  );
};
export function CoinListItem({
  id,
  meta,
  coinId,
  status,
  coinTitle,
  nonprofitLink,
  aptAmount,
  xAptAmount,
  imageSrc = "/images/coin/coin-avatar.png",
  showApproveAndRejectButtons = false,
}: CoinListItemProps) {
  const { registerMarket, cost } = useRegisterMarket();

  const { aptBalance } = useAptos();

  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | "launch" | null>(null);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-[#7BC67E]";
      case "pending":
        return "text-yellow-500";
      case "rejected":
        return "text-red";
      default:
        return "text-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "pending":
        return "Pending approval";
      case "rejected":
        return "Not approved";
      default:
        return "Unknown";
    }
  };

  const totalCost = useMemo(
    () => (cost ? cost + Number(MARKET_REGISTRATION_DEPOSIT) : undefined),
    [cost]
  );

  const sufficientBalance = useMemo(
    () => (totalCost ? aptBalance >= totalCost : undefined),
    [aptBalance, totalCost]
  );

  const onLaunchClick = async () => {
    try {
      setLoading("launch");
      await registerMarket({ ...meta, id: id } as any);
      setLoading(null);
    } catch (error) {
      console.log("onLaunchClick error: ", error);
      setLoading(null);
    }
  };

  const onStatusChange = useCallback(
    async (status: CoinStatus) => {
      setLoading(status == CoinStatus.REJECTED ? "reject" : "approve");
      const response = await updateCoin(coinId, { status });
      if (response.success) {
        toast.success("Coin status updated successfully");
        router.refresh();
      } else {
        toast.error("Failed to update coin status");
      }
      setLoading(null);
    },
    [coinId, router]
  );

  const getActionButton = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <ButtonWithConnectWalletFallback>
            <CircularButton
              onClick={onLaunchClick}
              disabled={!sufficientBalance || loading != null}
              loading={loading == "launch"}
            >
              {!sufficientBalance ? "Insufficient Balance" : "LAUNCH"}
            </CircularButton>
          </ButtonWithConnectWalletFallback>
        );
      case "pending":
        return <CircularButton disabled={true}>LAUNCH</CircularButton>;
      case "rejected":
        return <CircularButton disabled={loading != null}>TRY AGAIN</CircularButton>;
      default:
        return null;
    }
  };

  const getApproveAndRejectButtons = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <CircularButton
            disabled={loading != null}
            loading={loading == "approve"}
            onClick={() => onStatusChange(CoinStatus.APPROVED)}
          >
            APPROVE
          </CircularButton>
        );
      case "approved":
        return (
          <CircularButton
            disabled={loading != null}
            loading={loading == "reject"}
            onClick={() => onStatusChange(CoinStatus.REJECTED)}
          >
            REJECT
          </CircularButton>
        );
      case "rejected":
        return (
          <CircularButton
            disabled={loading != null}
            loading={loading == "approve"}
            onClick={() => onStatusChange(CoinStatus.APPROVED)}
          >
            APPROVE
          </CircularButton>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-xl rounded-full border border-white mb-4">
      <div className="flex items-center gap-8">
        <div className="relative p-3" style={{ borderRadius: "100%", border: "2px solid white" }}>
          <div className="w-[130px] h-[130px] rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 opacity-80">
              <Image
                src={imageSrc}
                alt={`${coinTitle} coin image`}
                width={140}
                height={140}
                className="object-cover w-full h-full mix-blend-overlay"
              />
            </div>
          </div>
          {/* <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg">
            <div className="text-black font-bold text-sm">V.</div>
          </div> */}
        </div>

        <div className="flex flex-col gap-2">
          <div className={`text-sm font-medium ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </div>
          <div className="text-xl font-bold text-white">
            <span className="uppercase">{coinTitle}</span>
          </div>
          <div className="text-sm text-white/80">
            Nonprofit benefited - website link:{" "}
            <a href={nonprofitLink} className="underline hover:text-white">
              {nonprofitLink}
            </a>
          </div>

          <div className="flex items-center gap-6 mt-2">
            <div className="flex items-center">
              <StyledImage className="mr-3 w-8 h-8" src="/images/coin/Aptos_White 2.png" />
              <span className="text-sm text-white/90 font-medium">{aptAmount} APT</span>
            </div>
            <div className="flex items-center">
              <div
                className="border border-white rounded-full p-1 px-2 mr-2"
                style={{ borderRadius: "100%", borderWidth: "2px" }}
              >
                <StyledImage src="/images/launch/dollar-symbol.png" />
              </div>
              <span className="text-sm text-white/90 font-medium">{xAptAmount} APT</span>
            </div>
          </div>
        </div>
      </div>

      {showApproveAndRejectButtons ? getApproveAndRejectButtons(status) : getActionButton(status)}
    </div>
  );
}
