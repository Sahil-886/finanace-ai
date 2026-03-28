import type { Metadata } from "next";
import "./globals.css";
import NavAndSidebar from "./components/NavAndSidebar";
import ChatWidget from "@/components/ChatWidget";
import { UserProvider } from "@/context/UserContext";

export const metadata: Metadata = {
  title: "AI Money Mentor — Editorial Premium",
  description: "Your authoritative Indian financial publication and planning suite.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <UserProvider>
          <NavAndSidebar>{children}</NavAndSidebar>
          <ChatWidget />
        </UserProvider>
      </body>
    </html>
  );
}
