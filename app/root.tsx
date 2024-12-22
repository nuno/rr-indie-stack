import type { LinksFunction, LoaderFunctionArgs } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import { getUser } from "~/session.server";

import "~/tailwind.css";
export const links: LinksFunction = () => [];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return { user: await getUser(request) };
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
