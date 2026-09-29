import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { DemoNoticeBar } from '../common/DemoNoticeBar';

export const StoreLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-[#172121]">
      <DemoNoticeBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
