export const metadata = {
  title: "Web Order",
  description: "Food ordering app"
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
