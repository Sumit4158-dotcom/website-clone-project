"use client";

import Image from "next/image";
import Link from "next/link";

const FloatingChat = () => {
  return (
    <Link
      href="#"
      className="fixed right-4 bottom-24 md:bottom-6 z-40 w-28 cursor-pointer transition-opacity duration-200 hover:opacity-80"
      aria-label="Open Live Chat"
    >
      <Image
        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/icons/livechat_bj-12.png?"
        alt="Live Chat Support"
        width={132}
        height={55}
        className="h-auto w-full"
      />
    </Link>
  );
};

export default FloatingChat;