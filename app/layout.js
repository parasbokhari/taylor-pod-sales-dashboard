import "./globals.css";

export const metadata = {
  title: "Cart Submissions",
  description: "Monitor and review cart form submissions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
