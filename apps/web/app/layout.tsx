import "./globals.css";
import { Lato } from 'next/font/google'
import StyledJsxRegistry from "./registry";
import NavigationHeader from './header';
import { PageContent } from "@repo/ui/containers";
import QueryClientProvider from "./queryProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curebase",
  description: "Curebase",
  robots: {
    index: false,
    follow: false,
  },
}

const lato = Lato({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
})

const navigationItems = [
  { href: "/participants", label: "Participants" },
  { href: "/trials", label: "Trials" },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <StyledJsxRegistry>
          <NavigationHeader
            navigationItems={navigationItems}
            logoSrc="/assets/svg/curebase-logo.svg"
            logoAlt="Curebase"
          />
          <PageContent>
            <QueryClientProvider>
              {children}
            </QueryClientProvider>
          </PageContent>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
