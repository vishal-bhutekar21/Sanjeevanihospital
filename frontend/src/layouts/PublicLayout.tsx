import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FloatingLanguageSwitcher } from '../components/FloatingLanguageSwitcher';

export const PublicLayout: React.FC = () => {
  return (
    // Bottom padding on phones = height of the fixed FloatingLanguageSwitcher bar
    // (py-2 + 44px buttons + border + safe area), so the footer is not hidden behind it.
    <div className="min-h-screen flex flex-col bg-transparent overflow-x-clip pb-[calc(53px+max(0.5rem,env(safe-area-inset-bottom)))] sm:pb-0">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingLanguageSwitcher />
    </div>
  );
};
