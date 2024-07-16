import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/authProvider";
import { Toaster } from 'react-hot-toast';

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
      <body className={inter.className} suppressHydrationWarning={true}>
        <main>
            <AuthProvider>
              {children}
              <Toaster 
              position="top-center"
              reverseOrder={false}
              />
            </AuthProvider>
        </main>
      </body>
    </html>
  );
}