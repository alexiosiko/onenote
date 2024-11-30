import { Poppins } from 'next/font/google'
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react"

const font = Poppins({
	subsets: ['latin'],
	weight: '400',
})


import type { Metadata, Viewport } from "next";

const APP_NAME = "OneNotee";
const APP_DEFAULT_TITLE = "OneNotee";
const APP_TITLE_TEMPLATE = "%s - OneNotee";
const APP_DESCRIPTION = "Note taking app!";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}> ) {
  return (
	<ClerkProvider>
		<html lang="en">
			<body
				className={`${font.className} overflow-hidden bg-secondary antialiased`}>
				{children}
				<Toaster />
				<Analytics />
			</body>
		</html>
	</ClerkProvider>
  );
}
