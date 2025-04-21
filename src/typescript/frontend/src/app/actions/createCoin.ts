"use server";

import { CoinStatus, type CoinsList, type Prisma } from "@prisma/client";
import { prisma } from "lib/prisma";

export interface CreateCoinParams {
  data: Prisma.JsonValue;
  emojiSlug: string;
  emojis: string[];
  creatorAddress?: string;
  status?: CoinStatus;
  meta: {
    title: string;
    description: string;
    imageURL: string;
    nonProfitName: string;
    nonProfitDescription: string;
    nonProfitImageURL: string;
    nonProfitLink: string;
  };
}
// replace all spaces with dash and remove all non-alphanumeric characters
const generateTitleSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

export async function createCoin(data: CreateCoinParams) {
  try {
    // if coin title is already taken, return error
    const existingCoin = await prisma.coinsList.findFirst({
      where: { titleSlug: generateTitleSlug(data.meta.title) },
    });
    if (existingCoin) {
      return { success: false, error: "Coin title already taken" };
    }

    const coin = await prisma.coinsList.create({
      data: {
        titleSlug: generateTitleSlug(data.meta.title),
        data: data.data,
        emojiSlug: data.emojiSlug,
        emojis: data.emojis,
        status: data.status || CoinStatus.PENDING,
        creatorAddress: data?.creatorAddress,
        meta: {
          title: data.meta.title,
          description: data.meta.description,
          imageURL: data.meta.imageURL,
          nonProfitName: data.meta.nonProfitName,
          nonProfitDescription: data.meta.nonProfitDescription,
          nonProfitImageURL: data.meta.nonProfitImageURL,
          nonProfitLink: data.meta.nonProfitLink,
        },
      },
    });
    return { success: true, data: coin };
  } catch (error) {
    console.error("Failed to create coin:", error);
    return { success: false, error: "Failed to create coin" };
  }
}

export async function getCoin(
  emojiSlug: string
): Promise<{ success: boolean; data: CoinsList | null; error?: string }> {
  try {
    const coin = await prisma.coinsList.findUnique({
      where: { emojiSlug },
    });
    return { success: true, data: coin };
  } catch (error) {
    console.error("Failed to get coin:", error);
    return { success: false, data: null, error: "Failed to get coin" };
  }
}

export async function updateCoin(
  coinId: string,
  data: Prisma.CoinsListUpdateInput
): Promise<{ success: boolean; data: CoinsList | null; message?: string }> {
  try {
    const coin = await prisma.coinsList.update({
      where: { id: coinId },
      data,
    });

    return { success: true, data: coin, message: "Coin updated successfully" };
  } catch (error) {
    console.error("Failed to update coin:", error);
    return { success: false, data: null, message: "Failed to update coin" };
  }
}

export async function getMyCoins(
  creatorAddress: string
): Promise<{ success: boolean; data: CoinsList[] | null; error?: string }> {
  try {
    const coins = await prisma.coinsList.findMany({
      where: { creatorAddress },
    });
    return { success: true, data: coins };
  } catch (error) {
    console.error("Failed to get my coins:", error);
    return { success: false, data: null, error: "Failed to get my coins" };
  }
}

export async function getAllCoins(): Promise<{
  success: boolean;
  data: CoinsList[] | null;
  message?: string;
}> {
  try {
    const coins = await prisma.coinsList.findMany();
    return { success: true, data: coins };
  } catch (error) {
    console.error("Failed to get all coins:", error);
    return { success: false, data: null, message: "Failed to get all coins" };
  }
}

export async function setLastIndex(): Promise<{
  success: boolean;
  data: number;
  message?: string;
}> {
  let index = 0
  try {
    const config = await prisma.config.findFirst();
    if (!config) {
      await prisma.config.create({
        data: { lastIndex: 0 },
      });
      return { success: true, message: "Config created successfully",  data: 0};
    }
    index = config.lastIndex
    await prisma.config.update({
      where: { id: config?.id },
      data: { lastIndex: (config?.lastIndex ?? 0) + 1 },
    });
  } catch (error) {
    console.error("Failed to get last index:", error);
  }
  return { success: true, message: "Last index set successfully",  data: index};
}
