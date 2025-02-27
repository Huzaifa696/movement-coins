"use server";

import { type CoinsList, type Prisma } from "@prisma/client";
import { prisma } from "lib/prisma";

interface CreateCoinParams {
  data: Prisma.JsonValue;
  emojiSlug: string;
  emojis: string[];
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
    const coin = await prisma.coinsList.create({
      data: {
        titleSlug: generateTitleSlug(data.meta.title),
        data: data.data,
        emojiSlug: data.emojiSlug,
        emojis: data.emojis,
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
