import { RegisterMarket } from "@/contract-apis/emojicoin-dot-fun";
import { useAptos } from "context/wallet-context/AptosContextProvider";
import {
  Ed25519PublicKey,
  isUserTransactionResponse,
  type PendingTransactionResponse,
  type UserTransactionResponse,
} from "@aptos-labs/ts-sdk";
import { INTEGRATOR_ADDRESS } from "lib/env";
import {
  MARKET_REGISTRATION_FEE,
  MARKET_REGISTRATION_GAS_ESTIMATION_FIRST,
  MARKET_REGISTRATION_GAS_ESTIMATION_NOT_FIRST,
} from "@sdk/const";
import { useEmojiPicker } from "context/emoji-picker-context";
import { SYMBOL_EMOJI_DATA } from "@sdk/emoji_data";
import { useNumMarkets } from "lib/hooks/queries/use-num-markets";
import { useQuery } from "@tanstack/react-query";
import { type AccountInfo } from "@aptos-labs/wallet-adapter-core";
import { createCoin } from "app/actions/createCoin";
import { stringToHex } from "utils/string-to-hex";
// import { stringToHex } from "@/utils/string-to-hex";

export const tryEd25519PublicKey = (account: AccountInfo) => {
  try {
    return new Ed25519PublicKey(
      typeof account.publicKey === "string" ? account.publicKey : account.publicKey[0]
    );
  } catch (_) {
    return undefined;
  }
};

export const useRegisterMarket = () => {
  const emojis = useEmojiPicker((state) => state.emojis);
  const setIsLoadingRegisteredMarket = useEmojiPicker(
    (state) => state.setIsLoadingRegisteredMarket
  );
  const clear = useEmojiPicker((state) => state.clear);
  const setPickerInvisible = useEmojiPicker((state) => state.setPickerInvisible);
  const { aptos, account, signThenSubmit } = useAptos();

  const { data: numMarkets } = useNumMarkets();

  // This is now used just for tracking whether the emoji is valid, but not for actual registration
  const emojiBytes = emojis.map((e) => SYMBOL_EMOJI_DATA.byEmoji(e)!.bytes);

  const { data: gasResult } = useQuery({
    queryKey: ["register-market-cost", numMarkets, account?.address, emojiBytes],
    queryFn: async () => {
      if (account === null) {
        return undefined;
      }
      const publicKey = tryEd25519PublicKey(account);
      if (!publicKey) {
        return {
          error: true,
          data: {
            amount: 0,
            unitPrice: 0,
          },
        };
      }
      try {
        // For gas estimation, we'll use a simple title string based on the emoji
        const titleBytes = stringToHex(emojis.join(''));
        
        const r = await RegisterMarket.getGasCost({
          aptosConfig: aptos.config,
          registrant: account.address,
          registrantPubKey: publicKey,
          titleBytes,
        });
        return r;
      } catch (e) {
        console.error(e);
        return undefined;
      }
    },
    staleTime: 1000,
    enabled:
      numMarkets !== undefined && account !== null && (numMarkets === 0 || emojis.length > 0),
  });

  let amount: number, unitPrice: number;

  if (gasResult && !gasResult.error) {
    amount = gasResult.data.amount;
    unitPrice = gasResult.data.unitPrice;
  } else {
    // If numMarkets is undefined (request not completed yet), we are ok with displaying the bigger number.
    // And in most cases (every time except for the first market), it will actually be the correct one.
    amount =
      numMarkets === 0
        ? MARKET_REGISTRATION_GAS_ESTIMATION_FIRST / 100
        : MARKET_REGISTRATION_GAS_ESTIMATION_NOT_FIRST / 100;
    unitPrice = 100;
  }

  const registerMarket = async (launchCoinData: {
    title: string;
    description: string;
    image: string;
    nonProfitName: string;
    nonProfitDescription: string;
    nonProfitImage: string;
    nonProfitLink: string;
  }) => {
    if (!account) {
      return;
    }

    // Set the picker invisible for the duration of the registration transaction.
    setPickerInvisible(true);
    let res: PendingTransactionResponse | UserTransactionResponse | undefined | null;
    let error: unknown;
    
    // Convert string fields to hex format for the contract
    const titleBytes = stringToHex(launchCoinData.title);
    const descriptionBytes = stringToHex(launchCoinData.description);
    const imageUrlBytes = stringToHex(launchCoinData.image);
    const nonProfitNameBytes = stringToHex(launchCoinData.nonProfitName || '');
    const nonProfitDescriptionBytes = stringToHex(launchCoinData.nonProfitDescription || '');
    const nonProfitImageUrlBytes = stringToHex(launchCoinData.nonProfitImage || '');
    const nonProfitLinkBytes = stringToHex(launchCoinData.nonProfitLink || '');
    
    const builderArgs = {
      aptosConfig: aptos.config,
      registrant: account.address,
      titleBytes,
      descriptionBytes,
      imageUrlBytes,
      nonProfitNameBytes,
      nonProfitDescriptionBytes,
      nonProfitImageUrlBytes,
      nonProfitLinkBytes,
      integrator: INTEGRATOR_ADDRESS,
    };
    
    const builderLambda = () =>
      RegisterMarket.builder({
        ...builderArgs,
        options: {
          maxGasAmount: Math.round(amount * 1.2),
          gasUnitPrice: unitPrice,
        },
      });
    await signThenSubmit(builderLambda).then((r) => {
      res = r?.response ?? null;
      error = r?.error;
    });

    if (res && isUserTransactionResponse(res)) {
      // We still create a slug from emojis for URL purposes
      const emojiSlug = emojis.map((e) => SYMBOL_EMOJI_DATA.byEmoji(e)!.name).join("-");
      await createCoin({
        data: res,
        emojiSlug,
        emojis: emojis.map((e) => SYMBOL_EMOJI_DATA.byEmoji(e)!.name),
        meta: {
          title: launchCoinData.title,
          description: launchCoinData.description,
          imageURL: launchCoinData.image,
          nonProfitName: launchCoinData.nonProfitName,
          nonProfitDescription: launchCoinData.nonProfitDescription,
          nonProfitImageURL: launchCoinData.nonProfitImage,
          nonProfitLink: launchCoinData.nonProfitLink,
        },
      });

      clear();
      // The event is parsed and added as a registered market in `event-store.ts`,
      // we don't need to do anything here other than set the loading state.
      setIsLoadingRegisteredMarket(true);
    } else {
      // If the transaction fails or the user cancels the transaction, we unset the loading state
      // and set the picker visible.
      // Note that we don't clear the input here, because the user may want to alter it to make it
      // correct and try again.
      setPickerInvisible(false);
      console.error("Error registering market:", error);
      setIsLoadingRegisteredMarket(false);
    }
  };

  // By default, just consider that this is the price, since in 99.99% of cases, this will be the most accurate estimate.
  let cost: number = Number(MARKET_REGISTRATION_FEE);

  // If numMarkets is undefined (request not completed yet), we are ok with choosing the second option.
  // And in most cases (every time except for the first market), it will actually be the correct one.
  if (numMarkets === 0) {
    cost = amount * unitPrice;
  } else {
    cost += amount * unitPrice;
  }

  return {
    registerMarket,
    cost,
  };
};
