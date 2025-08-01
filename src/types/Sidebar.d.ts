export type NavItem = {
    href: string;
    label: string;
   icon: React.FC<React.SVGProps<SVGSVGElement>>
  };
  
export type SidebarProps = {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    setNotification: Dispatch<SetStateAction<Notification | null>>;
  };