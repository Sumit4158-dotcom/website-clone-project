"use client";

import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="dark fixed top-0 left-0 right-0 z-50 flex h-[60px] items-center justify-between bg-background px-3 md:px-4 border-b border-border/50">
      <div className="flex flex-1 items-center gap-2 md:gap-4">
        {/* Hamburger Menu Icon */}
        <button className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center transition-colors hover:bg-secondary/50 rounded-full">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/icon-menu-1.png?"
            alt="Menu"
            width={20}
            height={20}
            className="md:w-6 md:h-6"
          />
        </button>

        {/* Logo */}
        <Link href="/">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/logo-2.png?"
            alt="baji logo"
            width={71}
            height={28}
            className="h-6 md:h-7 w-auto shrink-0"
            priority
          />
        </Link>
        
        {/* Navigation Links */}
        <nav className="ml-2 md:ml-4 hidden items-center gap-4 md:gap-6 lg:flex">
          <Link
            href="/slots"
            className="text-xs md:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Slots
          </Link>
          <Link
            href="/casino"
            className="text-xs md:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Casino
          </Link>
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 md:gap-3">
        {/* Language Selector */}
        <button className="flex items-center justify-center rounded-md p-1.5 md:p-2 transition-colors hover:bg-secondary">
          <Image 
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/BD-12.png?"
            alt="BD Flag"
            width={24}
            height={18}
            className="rounded-[2px] md:w-7 md:h-5"
          />
        </button>

        {/* Live Chat */}
        <button className="flex items-center justify-center rounded-md p-1.5 md:p-2 transition-colors hover:bg-secondary">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/icon-livechat-1.svg?"
            alt="Live Chat"
            width={20}
            height={20}
            className="md:w-6 md:h-6"
          />
        </button>

        {/* Auth Buttons */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className="flex h-8 md:h-9 items-center justify-center rounded-[4px] border border-border bg-transparent px-4 md:px-6 text-xs md:text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="flex h-8 md:h-9 items-center justify-center rounded-[4px] bg-primary px-4 md:px-6 text-xs md:text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;