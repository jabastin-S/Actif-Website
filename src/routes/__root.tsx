import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { MillisOrb } from "../components/MillisOrb";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ACTIF Global Ventures | Knitted textile development and manufacturing, Tiruppur" },
      {
        name: "description",
        content:
          "ACTIF Global Ventures, a unit of Vani Fabrics Private Limited with textile heritage since 1970, develops and manufactures knitted textiles in Tiruppur, India for home, upholstery, industrial and medical applications.",
      },
      { name: "author", content: "ACTIF Global Ventures" },
      { name: "theme-color", content: "#f4efe6" },
      { name: "robots", content: "index, follow" },
      { property: "og:site_name", content: "ACTIF Global Ventures" },
      { property: "og:url", content: "https://actif.ltd/" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:title", content: "ACTIF Global Ventures" },
      {
        property: "og:description",
        content: "Knitted textiles, developed and made in Tiruppur by a house with roots in 1970.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ACTIF Global Ventures",
          legalName: "ACTIF Global Ventures Pvt Ltd",
          url: "https://actif.ltd",
          email: "info@actif.ltd",
          telephone: "+919894602235",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Tiruppur",
            addressRegion: "Tamil Nadu",
            addressCountry: "IN",
          },
          parentOrganization: { "@type": "Organization", name: "Vani Fabrics Private Limited" },
          description:
            "Knitted textile development and manufacturing for home and bedding, upholstery, industrial and technical, and medical and healthcare applications.",
        }),
      },
    ],
    links: [
      { rel: "canonical", href: "https://actif.ltd/" },
      {
        rel: "preload",
        as: "image",
        type: "image/webp",
        href: "/images/macroSoft-800.webp",
        imageSrcSet:
          "/images/macroSoft-480.webp 480w, /images/macroSoft-800.webp 800w, /images/macroSoft-896.webp 896w",
        imageSizes: "(min-width:1280px) 30vw, (min-width:768px) 40vw, 92vw",
        fetchPriority: "high",
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Hanken+Grotesk:wght@400;500;600&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <MillisOrb />
    </QueryClientProvider>
  );
}
