import { Sour_Gummy } from "next/font/google";
import "./globals.css";

const sgu = Sour_Gummy({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "LiCiDrive",
  description: "Decentralized file storage and sharing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="hydrated">
      <body className={sgu.className}>
        <div className="min-h-screen bg-[#EEEEEE]">{children}</div>
      </body>
    </html>
  );
}
