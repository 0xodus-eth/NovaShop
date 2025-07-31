// app/layout.tsx
import Link from 'next/link';
import './globals.css'; // Import global styles

export const metadata = {
  title: 'NovaShop',
  description: 'Online Shop',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white shadow p-4">
          <nav className="max-w-4xl mx-auto flex space-x-6">
            <Link href="/" className="text-blue-600 hover:underline">Home</Link>
            <Link href="/order" className="text-blue-600 hover:underline">Place Order</Link>
          </nav>
        </header>
        <main className="max-w-4xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
