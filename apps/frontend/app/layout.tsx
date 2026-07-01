import 'leaflet/dist/leaflet.css';
import './globals.css';
import React from 'react';

export const metadata = {
  title: 'FoodBridge AI — Build a Billion-Dollar Food Redistribution SaaS',
  description: 'Intelligent food redistribution ecosystem reducing waste and fighting hunger using predictive AI logistics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gradient-mesh min-h-screen text-gray-100 antialiased scroll-smooth">
        {children}
      </body>
    </html>
  );
}
