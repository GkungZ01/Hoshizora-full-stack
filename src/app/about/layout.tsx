import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Hoshizora",
  description: "About Our Profile Creater from Hoshizora",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
