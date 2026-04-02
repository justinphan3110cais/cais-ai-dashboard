import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard Embed",
  robots: "noindex, nofollow",
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen overflow-auto bg-white">
      {children}
    </div>
  );
}
