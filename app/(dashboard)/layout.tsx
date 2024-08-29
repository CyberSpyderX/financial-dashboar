import Header from "@/components/header";

type LayoutProps = {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return <>
        <Header />
        <main className="px-3 lg:px-14">
            {children}
        </main>
    </>
}