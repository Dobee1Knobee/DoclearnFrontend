import 'bootstrap/dist/css/bootstrap.min.css';
import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat} from "next/font/google";
import "./globals.css";
import BootstrapClient from '@/app/providers/BootstrapClient';
import HeaderLogin from '@/widgets/header/ui/HeaderLogin';
import Footer from '@/widgets/footer/Footer';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const montserrat = Montserrat({
    
  variable: '--font-montserrat',
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "DocLearn",
  description: "Doclearn - Здоровье в знаниях!",
  icons: {
    icon: [
        {
            url: "/logoGoogle.png", 
        },
    ],
},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable}  antialiased`}
      >
        <HeaderLogin />
        {children}
        <Footer />
        <BootstrapClient />
      </body>
    </html>
  );
}
