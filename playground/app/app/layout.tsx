import { TopNav } from 'playground-feat-nav-ui';
import { PageContent } from 'playground-ui';
import { ReactNode } from 'react';

import './global.css';

export const metadata = {
  title: 'EasyBREAD Playground',
  description: 'EasyBREAD Playground',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="amber-100 scrollbar-thin scrollbar-thumb-amber-200 relative h-screen w-screen min-w-[720px] scroll-auto bg-zinc-100">
        <TopNav />
        <PageContent>{children}</PageContent>
      </body>
    </html>
  );
}
