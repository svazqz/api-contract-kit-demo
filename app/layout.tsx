import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'API Generator Demo',
  description: 'Next.js project using @svazqz/api-contract-kit',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
