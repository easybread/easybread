'use client';

import { useQuery } from '@tanstack/react-query';
import { AudioWaveform, Building2, Cable, SquareTerminal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { authClient } from 'saas-auth';
import { useTRPC } from 'saas-trpc';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '../../shadcn/sidebar';

import { NavMain } from './NavMain';
import { NavSwitcher } from './NavSwitcher';
import { NavUser } from './NavUser';

const data = {
  user: {
    name: 'Aleksandr Cherednichenko',
    email: 'aleksandr@space-architects.dev',
    avatar: 'https://i.pravatar.cc/300',
  },
  teams: [
    {
      name: 'Space Architects',
      logo: Building2,
      plan: 'Production',
    },
    {
      name: 'Test',
      logo: AudioWaveform,
      plan: 'Playground',
    },
  ],
  navMain: [
    {
      title: 'Workflows',
      url: '/workflows',
      urlPattern: '/workflows',
      icon: SquareTerminal,
    },
    {
      title: 'Connections',
      url: '/connections',
      urlPattern: '/workflows',
      icon: Cable,
    },
  ],
};

export function NavSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  const trpc = useTRPC();
  const authInfo = useQuery(trpc.auth.info.queryOptions());

  const logout = async () => {
    await authClient.signOut();
    router.push('/');
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={authInfo.data?.user} onLogout={logout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
