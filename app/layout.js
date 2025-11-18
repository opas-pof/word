import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "เกมค้นหาคำ 2025 - Word Search Game | Kapook",
  description: "เล่นเกมค้นหาคำ 2025 ง่ายๆ ค้นหาคำศัพท์ที่ซ่อนอยู่ในตารางตามลำดับที่กำหนด ผ่านแต่ละ Level เพื่อปลดล็อค Level ถัดไป",
  keywords: "เกมค้นหาคำ, word search, word search game, เกมคำศัพท์, เกม 2025",
  openGraph: {
    title: "เกมค้นหาคำ 2025 - Word Search Game",
    description: "เล่นเกมค้นหาคำ 2025 ง่ายๆ ค้นหาคำศัพท์ที่ซ่อนอยู่ในตาราง",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <Script id="truehit-page" strategy="beforeInteractive">
          {`page='wordsearch';`}
        </Script>
      </head>
      <body>
        <Script id="truehit-tracker" strategy="afterInteractive">
          {`(function(){var ga1 = document.createElement('script');ga1.type='text/javascript';ga1.async=true;ga1.src="//lvs.truehits.in.th/dataa/a0000034.js";var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(ga1, s);})();`}
        </Script>
        <Script 
          src="https://cdn.thelead.tech/lead/lead-latest.js" 
          data-project-id="kapook" 
          data-domain="kapook.com"
          strategy="afterInteractive"
        />
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-DBZBLF8EQ4" 
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DBZBLF8EQ4');
          `}
        </Script>
      <header className="w-full bg-[#3ec9b0] text-white relative">
          <div className="container mx-auto">
            <div className="h-16 flex items-center gap-4">
              <Link href="/" className="inline-flex items-center">
                <img src="https://my.kapook.com/img-portal/logo-kapook.png" alt="Kapook" className="h-[53px] w-[168px]" />
              </Link>
              <div className="flex items-center ml-4">
                <strong className="text-3xl font-semibold text-white">Word Search</strong>
              </div>
            </div>
          </div>
          <div id="truehits_div" className="absolute top-2 right-4"></div>
        </header>
        <div className="nav w-full h-[45px]">
          <nav className="container h-full">
            <ul>
              <li className="active"><a href="/">หน้าแรก</a></li>
              <li><a href="/2568">ดูดวง 2568</a></li>
              <li><a href="/horo_daily.php">ดูดวงรายวัน</a></li>
              <li><a href="/horo_love.php">ดูดวงความรัก</a></li>
              <li><a href="/tarot.php">ดูดวงไพ่ยิปซี</a></li>
              <li><a href="/horo_birthday.php">ดูดวงวันเดือนปีเกิด</a></li>
              <li><a href="/fortuneteller">เช็กดวงกับหมอดัง</a></li>
              <li><a href="/dream">ทำนายฝัน</a></li>
            </ul>
          </nav>
        </div>
        {children}
      </body>
    </html>
  );
}
