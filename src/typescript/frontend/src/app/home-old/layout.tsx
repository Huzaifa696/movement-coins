import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "MOVEMENT COIN",
  description: "MOVEMENT COIN",
};

export default async function HomeLayout({ children }: Readonly<{
  children: React.ReactNode;
}>): Promise<JSX.Element> {
  return (
    <>
      {children}
    </>
  );
}
