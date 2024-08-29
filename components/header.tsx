import { Loader2 } from "lucide-react";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";

import HeaderLogo from "./header-logo";
import Navigation from "./Navigation";
import { WelcomeMsg } from "./welcome-msg";
import { Filters } from "./Filters";

export default function Header() {
    return <header className="bg-gradient-to-b from-blue-700 to-blue-600 px-4 py-8 lg:px-14 pb-36">
        <div className="max-w-screen-2xl mx-auto">
            <div className="w-full flex items-center justify-between mb-14">
                <div className="flex items-center lg:gap-x-16">
                    <HeaderLogo />
                    <Navigation />
                </div>
                <ClerkLoading>
                    <Loader2 className="animate-spin text-muted-foreground" />
                </ClerkLoading>
                <ClerkLoaded>
                    <UserButton />
                </ClerkLoaded>
            </div>
            <WelcomeMsg />
            <Filters />
        </div>
    </header>
}