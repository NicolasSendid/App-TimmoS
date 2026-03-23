export const metadata = {
  title: "App TimmoS",
  description: "Application estimation immobilière",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
