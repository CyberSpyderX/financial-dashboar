import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavButtonProps = {
    label: string;
    href: string;
    isActive: boolean;
}

export default function NavButton({
    label,
    href,
    isActive
}: NavButtonProps) {
    return (
        <Button
            asChild
            size='sm'
            variant='outline'
            className={
                cn(
                    "text-white bg-transparent hover:bg-white/20 hover:text-white  w-full border-none lg:w-auto font-normal focus-visible:ring-offset-0 focus-visible:ring-transparent transition focus:bg-white/30",
                    isActive ? 'bg-white/20 text-white' : ''
                )
            }
        >
            <Link href={href}>
                {label}
            </Link>
        </Button>
    );
}