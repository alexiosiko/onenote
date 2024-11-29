import type { Metadata } from "next";
import { Poppins } from 'next/font/google'
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react"

const font = Poppins({
	subsets: ['latin'],
	weight: '400',
})


export const metadata: Metadata = {
  title: "OneNote",
  description: "A free one note taking application.",
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
