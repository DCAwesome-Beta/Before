"use client";

// components/navbar.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const Navbar = () => {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const { logout } = useLogout();
  const signerStatus = useSignerStatus();
  const router = useRouter(); // Initialize Next.js router

  // Define handleLogout before using it in the JSX
  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await logout(); // Call the logout function
      console.log("Logged out, redirecting...");
      
      // Check if the user is still logged in after logout
      if (!user) {
        router.push("/"); // Redirect to the landing page after logout
      } else {
        console.error("Logout failed: User is still logged in");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="py-4 px-20 flex justify-between navbar">
      <Link href="/" className="text-3xl font-bold hover:text-gray-400 logo">
        DCAwesome
      </Link>
      <div className="flex items-center space-x-6">
        <ul className="flex space-x-4 pixelfont">
          <li>
            <Link href="/about" className="hover:text-gray-400">About</Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-gray-400">Contact</Link>
          </li>
        </ul>

        {signerStatus.isInitializing ? (
          <p>Loading...</p>
        ) : user ? (
          <Button className="btn btn-primary" onClick={handleLogout}>
            Log out
          </Button>
        ) : (
          <Button className="btn btn-primary" onClick={openAuthModal}>
            Login
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;