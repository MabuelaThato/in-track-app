import { AuthProvider } from "@/components/authProvider";
import Nav from "@/components/nav";
import { Poppins } from "next/font/google";

const poppins = Poppins({weight: ['400', '500'],subsets: ['latin']});

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
      <body className={poppins.className}>
        <div>
            <AuthProvider>
            <Nav />
              {children}
            </AuthProvider>
        </div>
      </body>
    </html>
  );
}