import Image from "next/image";
import Link from "next/link";

export default function HeaderLogo() {
    return (
        <Link href={'/'}>
            <div className="lg:flex hidden items-center">
                <Image src={'./logo.svg'} height={28} width={28} alt="Home"/>
                <p className="font-poppins text-white text-2xl font-semibold ml-2.5">
                    CyFi
                </p>
            </div>
        </Link>
    );
}