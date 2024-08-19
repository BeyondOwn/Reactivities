import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import ReactQueryProvider from "@/utils/ReactQueryProvider";
import { UserProvider } from "@/utils/UserContext";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import "./globals.css";

const inter = FontSans({ subsets: ["latin"] });

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
 {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen font-sans antialiased",
          fontSans.variable
        )}>
          <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <ToastContainer position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                    transition={Bounce}/>
        <ReactQueryProvider>
        <Navbar/>
        {children}
        </ReactQueryProvider>
        </ThemeProvider>
        </UserProvider>
        </body>
    </html>
  );
}
