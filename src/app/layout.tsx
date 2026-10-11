import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://projectdhurandhar.automationlabs.online"),
  title: {
    default: "Project Dhurandhar — Road to ₹30CR Revenue | Dr. Ajay Kumar",
    template: "%s | Project Dhurandhar — Road to ₹30CR",
  },
  description:
    "Daily public journal documenting Dr. Ajay Kumar and AI Automation Labs LLP as we execute our road to ₹30 Crore revenue. Daily episodes, transparent numbers, and AI insights.",
  keywords: [
    "Project Dhurandhar",
    "Dr. Ajay Kumar",
    "AI Automation Labs",
    "Road to 30CR",
    "Enterprise Automation",
    "Founder Journey",
    "Daily Vlog",
    "Indian Tech Startup",
  ],
  authors: [{ name: "Dr. Ajay Kumar", url: "https://automationlabs.online" }],
  openGraph: {
    title: "Project Dhurandhar — Road to ₹30CR Revenue",
    description:
      "Building towards ₹30 crore. One day at a time. The daily documentary by Dr. Ajay Kumar and AI Automation Labs LLP.",
    url: "https://projectdhurandhar.automationlabs.online",
    siteName: "Project Dhurandhar",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Dhurandhar — Road to ₹30CR Revenue",
    description: "Daily episodes and transparent revenue reporting by Dr. Ajay Kumar.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('dhurandhar-theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-[#fcfbf7] text-slate-900 dark:bg-[#07090e] dark:text-slate-100 antialiased min-h-screen flex flex-col transition-colors duration-150`}>
        {children}
      </body>
    </html>
  );
}
