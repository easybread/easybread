import './global.css';
import { ReactNode } from 'react';
import { TopNav } from 'playground-feat-nav-ui';
import { PageContent } from 'playground-ui';

export const metadata = {
  title: 'EasyBREAD Playground',
  description: 'EasyBREAD Playground',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="h-screen w-screen min-w-[720px] relative bg-zinc-100 amber-100 scrollbar-thin scrollbar-thumb-amber-200 scroll-auto">
        <TopNav />
        <PageContent>{children}</PageContent>
      </body>
    </html>
  );
}
