import 'bootstrap/dist/css/bootstrap.min.css'
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import Header from '@/widgets/header/ui/Header'
import { Providers } from "./providers"

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
            url: "/logoGoogle.webp", 
        },
    ],
},
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${montserrat.variable}  antialiased`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
