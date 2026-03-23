import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "App-TimmoS",
  description: "Outil immobilier intelligent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
