'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../shadcn/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../../shadcn/sidebar';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    urlPattern: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map(item =>
          item.items ? (
            <MenuGroup key={item.title} item={item} />
          ) : (
            <SingleItem key={item.title} item={item} />
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function SingleItem({
  item,
}: {
  item: {
    title: string;
    url: string;
    urlPattern: string;
    icon?: LucideIcon;
  };
}) {
  const path = usePathname();
  const isActive = `${path}`.startsWith(item.url);
  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton isActive={isActive}>
        {item.icon && <item.icon />}
        <Link prefetch={true} href={item.url}>
          {item.title}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function MenuGroup({
  item,
}: {
  item: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  };
}) {
  const path = usePathname();
  const isActive = `${path}`.startsWith(item.url);

  return (
    <Collapsible
      key={item.title}
      asChild
      defaultOpen={isActive}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight
              className="ml-auto transition-transform duration-200
                group-data-[state=open]/collapsible:rotate-90"
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map(subItem => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton asChild>
                  <Link href={subItem.url} prefetch={true}>
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
