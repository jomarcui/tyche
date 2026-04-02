import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex bg-gray-50">
        <AuthProvider>
          <div className="min-h-screen flex-1">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
