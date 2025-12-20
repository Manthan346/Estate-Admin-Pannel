import React from 'react';
import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import realestatelogo from '../assets/realestatelogo.jpg'
import { useAuth } from '../Context/AuthContext';

export default function Navbar() {
    const {Logout,token,setToken} = useAuth()
  const handleLogout = () => {
    Logout()
    
    // Add your logout logic here
  };

  return (
    <nav className="w-full border-b border-border bg-background px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo and Company Name */}
        <div className="flex items-center gap-2 sm:gap-3">
          <img 
            src={realestatelogo}
            alt="Company Logo" 
            className="h-7 w-7 sm:h-8 sm:w-8"
          />
          <span className="text-lg sm:text-xl font-semibold text-foreground">
            <span className="hidden sm:inline">PrimeNest Reality</span>
          
          </span>
        </div>

        {/* User Profile with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center h-10 w-10 rounded-full bg-muted hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring">
              <User className="h-5 w-5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover border border-border shadow-lg rounded-md p-1">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-medium text-popover-foreground">John Doe</p>
              <p className="text-xs text-muted-foreground">john.doe@example.com</p>
            </div>
            <DropdownMenuItem 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent rounded-sm mt-1 text-popover-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}