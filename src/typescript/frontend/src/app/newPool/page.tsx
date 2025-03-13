import { ClientNewPoolPage } from "../../components/pages";
import { type Metadata } from "next";
import { emoji } from "utils";

export const revalidate = 2;

export const metadata: Metadata = {
  title: "Pools | Movement Coins",
  description: `Add liquidity to pools and earn rewards. We donate 1% of all pools to social causes.`,
};

// Define the type here since we can't import it directly
type NewPoolData = {
  // Add necessary properties here
};

type NewPoolSearchParams = {
  baseEmoji: string | null;
  quoteEmoji: string | null;
};

/**
 * Pools page for viewing and creating new liquidity pools
 */
export default async function NewPoolPage({ searchParams }: { searchParams: NewPoolSearchParams }) {
  try {
    // Here you would fetch any initial data needed for the pools page
    // For now, we'll just pass an empty initialData
    const initialData = {}; // Empty object works since we don't have required fields yet

    return <ClientNewPoolPage initialData={initialData} />;
  } catch (error) {
    console.error("Error in NewPoolPage:", error);
    throw error; // Let Next.js error boundaries handle it
  }
} 