import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FloatingLanguageSwitcher } from '../components/FloatingLanguageSwitcher';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent overflow-x-clip">
      <Header />
      <main className="flex-1 pb-16 sm:pb-0">
        <Outlet />
      </main>
      <Footer />
      <FloatingLanguageSwitcher />
    </div>
  );
};
