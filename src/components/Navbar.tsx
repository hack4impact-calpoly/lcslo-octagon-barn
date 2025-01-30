import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className="w-full px-8 py-8">
      <nav className="flex justify-between items-center w-full">
        {/* logo */}
        <div className="pl-16 pr-8 pt-10">
          <Link href="/">
            <Image src="/logo.png" alt="Octagon Barn Logo" width={182} height={64} />
          </Link>
        </div>

        {/* notification & profile */}
        <div className="flex items-center space-x-20 pl-10 pr-16 pt-10">
          <Link href="/somePage" className="text-black hover:text-blue-500">
            Notification {/* CHANGE TO IMAGE */}
          </Link>

          <Link href="/somePage" className="text-black hover:text-blue-500">
            Profile {/* CHANGE TO IMAGE */}
          </Link>
        </div>
      </nav>
    </div>
  );
}
