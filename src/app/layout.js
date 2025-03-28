import { Geist } from "next/font/google";
import Head from "next/head"; // Import Head for meta tags
import "./globals.css";

const geist = Geist({ subsets: ["latin"], weight: "400" });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" /> {/* Moved to the first meta tag */}
        <meta
          name="google-site-verification"
          content="pGAnPVO3GsiwCkgVCrHjQPo-Qjt5vZSCKmbUM6jAVG4"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://aiguru.vercel.app/" />
        <title>AI Guru: Doubt Solver with AI for Education</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Explore AI and education with our artificial intelligence in education platform! Solve doubts instantly using our math problem solver powered by artificial intelligence on education."
        />
        <meta
          name="keywords"
          content="ai in education, education in ai, ai on education, ai for education, artificial intelligence in education, ai and education, artificial intelligence and education, artificial intelligence on education, math problem solver"
        />
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-D7K9P2R0NV"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-D7K9P2R0NV');
          `,
          }}
        />
        <meta name="author" content="D. Raju Rao" />
        <meta name="robots" content="index, follow" />
        {/* Open Graph Meta Tags */}
        <meta
          property="og:title"
          content="AI Guru: Doubt Solver with AI for Education"
        />
        <meta
          property="og:description"
          content="Explore AI and education with our artificial intelligence in education platform! Solve doubts instantly using our math problem solver powered by artificial intelligence on education."
        />
        <meta property="og:url" content="https://aiguru.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://aiguru.vercel.app/og-image.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="AI Guru" />
      </head>
      <body className={geist.className}>{children}</body>
    </html>
  );
}
