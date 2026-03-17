import "./globals.css";

export const metadata = {
  title: "Cart Submissions | Print on Demand Catalog | Taylor",
  description:
    "Monitor and review cart form submissions from Print on Demand Catalog on Taylor.com",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
