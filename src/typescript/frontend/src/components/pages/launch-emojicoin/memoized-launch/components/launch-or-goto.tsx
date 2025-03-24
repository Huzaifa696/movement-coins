import { useEmojiPicker } from "context/emoji-picker-context";
import Button from "components/button";
import ButtonWithConnectWalletFallback from "components/header/wallet-button/ConnectWalletButton";
import { translationFunction } from "context/language-context";
import Link from "next/link";
import path from "path";
import { ROUTES } from "router/routes";

export const LaunchButtonOrGoToMarketLink = ({
  onWalletButtonClick,
  registered,
  invalid,
  titleSlug,
}: {
  onWalletButtonClick: () => void;
  registered?: boolean;
  invalid: boolean;
  titleSlug?: string;
}) => {
  const emojis = useEmojiPicker((state) => state.emojis);
  const { t } = translationFunction();

  const scrambleProps = {
    overdrive: true,
    overflow: true,
  };

  // Generate a URL path based on title slug if available, otherwise use emojis
  const marketPath = titleSlug 
    ? path.join(ROUTES.coin, titleSlug) 
    : path.join(ROUTES.market, emojis.join(""));

  return (
    <>
      <ButtonWithConnectWalletFallback>
        {registered ? (
          <Link
            className="font-lora text-lg uppercase text-ec-blue"
            href={marketPath}
          >
            <Button scale="lg" scrambleProps={scrambleProps}>
              {t("Go to market")}
            </Button>
          </Link>
        ) : (
          <Button
            disabled={invalid || typeof registered === "undefined"}
            onClick={onWalletButtonClick}
            scale="lg"
            style={{ cursor: invalid ? "not-allowed" : "pointer" }}
            scrambleProps={scrambleProps}
          >
            {t(invalid ? "Invalid input" : "Launch Coin")}
          </Button>
        )}
      </ButtonWithConnectWalletFallback>
    </>
  );
};

export default LaunchButtonOrGoToMarketLink;
