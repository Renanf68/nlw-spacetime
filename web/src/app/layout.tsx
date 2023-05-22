import "./globals.css";
import { cookies } from "next/headers";
import { Roboto_Flex, Bai_Jamjuree } from "next/font/google";
import { Hero } from "@/components/Hero";
import { Profile } from "@/components/Profile";
import { SignIn } from "@/components/SignIn";
import { Copyright } from "@/components/Copyright";

const roboto = Roboto_Flex({ subsets: ["latin"], variable: "--font-roboto" });
const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  display: "swap",
  weight: "700",
  variable: "--font-bai-jamjuree",
});

export const metadata = {
  title: "NLW Spacetime",
  description: "Projeto desenvolvido durante o NWL",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = cookies().has("token");
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${baiJamjuree.variable} font-sans text-gray-100 bg-gray-900`}
      >
        <main className="grid grid-cols-2 min-h-screen">
          {/* Left */}
          <div className="flex flex-col items-start justify-between px-28 py-16 relative overflow-hidden border-r border-white/10 bg-[url(../assets/bg-stars.svg)] bg-cover">
            {/* Blur */}
            <div className="absolute right-0 top-1/2 h-[288px] w-[526px] -translate-y-1/2 translate-x-1/2 bg-purple-700 opacity-50 rounded-full blur-full" />
            {/* Stripes */}
            <div className="absolute bottom-0 right-1 top-0 w-2 bg-stripes" />
            {isAuthenticated ? <Profile /> : <SignIn />}
            <Hero />
            <Copyright />
          </div>
          {/* Right */}
          <div className="flex flex-col p-16 bg-[url(../assets/bg-stars.svg)] bg-cover max-h-screen overflow-y-scroll">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
