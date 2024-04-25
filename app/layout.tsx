import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/authProvider";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "inTrack",
  description: "A learner management web application",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <head>
      <link
        rel="icon"
        href="/icon?<generated>"
        type="image/png"
        sizes="any"
      />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <main>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
        </main>
      </body>
    </html>
  );
}