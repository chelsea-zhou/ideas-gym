'use client'
import { UserButton } from "@clerk/nextjs";
import { MdPayment } from "react-icons/md";



function CustomUserButton() {
  return (
    <UserButton 
        appearance={{
        elements: {
            userButtonAvatarBox: "w-10 h-10 rounded-full",
            userButtonTrigger: "hover:opacity-80 transition-opacity"
        }
        }}
        afterSignOutUrl="/"
    >
        <UserButton.MenuItems>
        <UserButton.Link label="Subscription" labelIcon={<MdPayment />} href="/stripe/billing" />
        </UserButton.MenuItems>
    </UserButton>
  );
}

export default CustomUserButton;
