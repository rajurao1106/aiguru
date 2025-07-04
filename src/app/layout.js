import { Geist } from "next/font/google";
import Head from "next/head"; // Import Head for meta tags
import "./globals.css";
import Script from "next/script";

import Providers from "./App";

const geist = Geist({ subsets: ["latin"], weight: "400" });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://aiguru.vercel.app/" />
        <title>
          AI Guru – Smart AI Learning Tools for Personalized Education
        </title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Instantly solve study doubts with our AI-powered math problem solver. Explore smart tools designed for personalized learning and modern education using artificial intelligence."
        />
        <meta
          name="keywords"
          content="AI Guru, AI quiz generator, AI test maker, personalized learning, educational technology, edtech platform, smart classroom, AI-powered study tools, computer assisted learning, digital classroom, electronic learning, ICT in education"
        />

        {/* Moved to the first meta tag */}
        <meta
          name="google-site-verification"
          content="pGAnPVO3GsiwCkgVCrHjQPo-Qjt5vZSCKmbUM6jAVG4"
        />
        {/* Google Tag Manager */}
        <Script
          id="gtm-inline"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-NRSCH6XG');
    `,
          }}
        />

        {/* Google Analytics */}
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
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
          content="The leading AI platform for educators and students. Experience personalized learning, instant solutions, and smart tools to save time and boost academic success."
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
        {/* Instagram Link */}
        <meta property="og:site_name" content="AI Guru" />
        <meta
          property="og:url"
          content="https://www.instagram.com/aiguru_for_learning/"
        />
      </head>
      <body className={geist.className}>
        {/* Google Tag Manager (noscript) - Must be inside <body> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NRSCH6XG"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
