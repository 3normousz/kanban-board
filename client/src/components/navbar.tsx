import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MenuIcon } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  const linkStyles = "inline-flex h-9 px-4 py-2 text-sm font-medium rounded-md bg-white hover:bg-gray-100 text-gray-900 hover:text-gray-700"
  const logoutStyles = "inline-flex h-9 px-4 py-2 text-sm font-medium rounded-md bg-white hover:bg-red-100 text-red-600 hover:text-red-700"
  const mobileLinkStyles = "flex w-full items-center py-2 px-4 text-lg font-semibold text-gray-900 hover:bg-gray-100 rounded-md"

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="grid gap-2 py-6">
            <Link to="/home" className={mobileLinkStyles}>
              Home
            </Link>
            <Link to="/about" className={mobileLinkStyles}>
              Notification
            </Link>
            <button onClick={handleLogout} className={`${mobileLinkStyles} text-red-600`}>
              Logout
            </button>
          </div>
        </SheetContent>
      </Sheet>
      <nav className="ml-auto hidden lg:flex gap-6">
        <Link to="/home" className={linkStyles}>
          Home
        </Link>
        <Link to="/about" className={linkStyles}>
          Notification
        </Link>
        <button onClick={handleLogout} className={logoutStyles}>
          Logout
        </button>
      </nav>
    </header>
  );
}