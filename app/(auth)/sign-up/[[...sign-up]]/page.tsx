import { SignUp, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Page() {
    return <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="h-full lg:flex flex-col items-center justify-center">
            <div className="text-center space-y-4 pt-16">
                <h1 className="text-3xl font-bold text-[#2E2A47]">Welcome!</h1>
                <p className="text-base text-[#7E8CA0]">
                    Log in or Create account to get back to your dashboard!
                </p>
            </div>
            <div className="flex justify-center items-center mt-8">
                <ClerkLoading>
                    <Loader2 className="animate-spin text-muted-foreground" />
                </ClerkLoading>
                <ClerkLoaded>
                    <SignUp path="/sign-up" />
                </ClerkLoaded>
            </div>
        </div>
        <div className="bg-black h-full hidden lg:flex items-center justify-center">
            <Image src={'./logo.svg'} height={100} width={100} alt=""/>
        </div>
    </div>;
}