import React, { useState } from 'react';
import { TrendingUp, Menu, X } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-[#010205] border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="bg-purple-500/10 p-2 rounded-lg">
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
            <span className="ml-2 text-2xl font-bold text-white">TRON APP</span>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-gray-300">Bem-vindo, <span className="text-purple-400 font-medium">{user.username}</span></span>
            <button
              onClick={onLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Sair
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-purple-500/10 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-purple-500/20">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <div className="px-3 py-2 text-purple-400 font-medium">
              Bem-vindo, {user.username}
            </div>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onLogout();
              }}
              className="w-full text-left block px-3 py-2 text-base font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}