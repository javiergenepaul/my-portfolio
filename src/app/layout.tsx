import type { Metadata } from "next";
import { Inter, Poppins, Work_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

// ─── Font definitions (replaces typeface-* npm packages) ─────────────────────
// Variable names use a distinct suffix (-variable) to avoid circular reference
// when Tailwind v4 @theme maps --font-inter → var(--font-inter-variable).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-variable",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins-variable",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans-variable",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Gene Paul Mar Javier",
    default: "Gene Paul Mar Javier — Full-Stack Engineer",
  },
  description:
    "Full-stack software engineer specializing in React, Spring Boot, and modern web technologies.",
  metadataBase: new URL("https://genepaulmarjavier.dev"),
  icons: {
    icon: "/javi-logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Gene Paul Mar Javier Portfolio",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // Class is hydrated client-side by ThemeProvider (e.g. "dark emerald")
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${poppins.variable} ${workSans.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* ── Splash screen ───────────────────────────────────────────────────
            Rendered as raw HTML so it appears before any JS executes.
            The inline script reads localStorage to match the user's saved
            theme — preventing a flash of the wrong background colour.
            SplashRemover (inside Providers) fades it out after hydration.
        ─────────────────────────────────────────────────────────────────── */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          #__splash {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #08080c;
            color: #f0f0f0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
            transition: opacity 0.5s ease;
          }
          #__splash[data-light] {
            background: #ffffff;
            color: #08080c;
          }
          .__splash-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            animation: __splash-rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
          }
          .__splash-logo {
            animation: __splash-logo-pulse 2.4s ease-in-out infinite;
          }
          .__splash-name {
            margin: 0;
            font-size: 1.15rem;
            font-weight: 600;
            letter-spacing: 0.06em;
            opacity: 0.92;
          }
          .__splash-role {
            margin: 0;
            font-size: 0.72rem;
            font-weight: 400;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            opacity: 0.45;
          }
          .__splash-dots {
            display: flex;
            gap: 7px;
            margin-top: 4px;
          }
          .__splash-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: currentColor;
            opacity: 0.25;
            animation: __splash-dot-pulse 1.3s ease-in-out infinite;
          }
          .__splash-dot:nth-child(2) { animation-delay: 0.18s; }
          .__splash-dot:nth-child(3) { animation-delay: 0.36s; }
          @keyframes __splash-rise {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
          @keyframes __splash-logo-pulse {
            0%, 100% { opacity: 0.85; transform: scale(1);    }
            50%       { opacity: 1;    transform: scale(1.06); }
          }
          @keyframes __splash-dot-pulse {
            0%, 80%, 100% { opacity: 0.25; transform: scale(1);   }
            40%            { opacity: 0.9;  transform: scale(1.35); }
          }
        `,
          }}
        />

        <div id="__splash">
          <div className="__splash-content">
            {/* Logo — uses currentColor so it adapts to dark/light */}
            <div className="__splash-logo">
              <svg
                width="72"
                height="72"
                viewBox="0 0 69 69"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="69"
                  height="69"
                  rx="34.5"
                  fill="currentColor"
                  fillOpacity="0.08"
                />
                <rect
                  x="5.25"
                  y="5.25"
                  width="58.5"
                  height="58.5"
                  rx="29.25"
                  stroke="currentColor"
                  strokeOpacity="0.3"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M30.0798 25.1276V18.0002C13.3577 18.8912 10.2738 45.5501 31.1078 47.3319C43.3339 47.3319 48.5148 34.722 44.2659 26.087H31.1763V33.4885H38.8518C38.9889 37.3262 35.1511 41.3696 29.6001 40.3416C20.2797 38.0801 21.7875 26.0185 30.0798 25.1276Z"
                  fill="currentColor"
                />
                <path
                  d="M31.1078 18.0002V24.7849H45.0198C48.8576 30.6786 49.1454 47.4415 31.1078 48.4284V55.8299C46.9384 55.8299 62.2895 36.778 48.8576 18.0002H31.1078Z"
                  fill="currentColor"
                />
                <path
                  d="M30.0193 55.8235L30.0193 48.54L24.3126 48.54C27.6405 50.7316 29.132 54.3088 29.4364 55.8235L30.0193 55.8235Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <p className="__splash-name">Gene Paul Mar Javier</p>
            <p className="__splash-role">Full-Stack Engineer</p>
            <div className="__splash-dots">
              <span className="__splash-dot" />
              <span className="__splash-dot" />
              <span className="__splash-dot" />
            </div>
          </div>
        </div>

        {/* Reads saved theme from localStorage before React runs — prevents
            a flash of the wrong background on themed (non-dark) sessions.  */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function() {
            try {
              var raw = localStorage.getItem('portfolio-settings');
              var state = raw ? JSON.parse(raw).state : {};
              var theme = state && state.theme ? state.theme : 'system';
              var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              var isDark = theme === 'dark' || (theme === 'system' && prefersDark);
              if (!isDark) {
                document.getElementById('__splash').setAttribute('data-light', '');
              }
            } catch(e) {}
          })();
        `,
          }}
        />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
