"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMedia } from "react-use";
import { useState } from "react";
import { Menu } from "lucide-react";

import NavButton from "./NavButton";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
} from '@/components/ui/sheet';
import { Button } from "./ui/button";

const routes = [
    {
        href: '/',
        label: 'Overview'
    },
    {
        href: '/transactions',
        label: 'Transactions'
    },
    {
        href: '/accounts',
        label: 'Accounts'
    },
    {
        href: '/categories',
        label: 'Categories'
    },
    {
        href: '/settings',
        label: 'Settings'
    },
];

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const isMobile = useMedia("(max-width: 1024px)", false);
    
    const onClick = (href: string) => {
        router.push(href);    
        setIsOpen(false);
    }

    if(isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button
                        
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-none hover:bg-white/20 focus-visible:ring-offset-0 focus-visible:ring-transparent transition focus:bg-white/30 text-white hover:text-white"

                    >
                        <Menu className="size-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="px-2">
                    <nav className="flex flex-col gap-y-2 pt-6">
                        {routes.map(route => 
                            <Button
                                key={route.href}
                                variant={route.href  === pathname ? "secondary" : "ghost"}
                                onClick={() => onClick(route.href)}
                                className="justify-start"
                            >
                                {route.label}
                            </Button>
                        )}
                    </nav>
                </SheetContent>
            </Sheet>
        );
    }
    return (
        <div className="hidden lg:flex gap-x-2 items-center overflow-x-auto">
            {routes.map(route => 
                <NavButton 
                    key={route.href}
                    href={route.href}
                    label={route.label}
                    isActive={pathname === route.href}
                />
            )}
        </div>
    );
}