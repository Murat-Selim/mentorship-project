import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { BookOpen } from 'lucide-react';

const Navbar = () => {
  const { account, connectWallet } = useWeb3();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Sol Kısım: Logo */}
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <Link to="/" className="ml-2 text-xl font-bold text-gray-800">
              MentorshipDApp
            </Link>
          </div>

          {/* Orta Kısım: Linkler */}
          <div className="hidden md:flex space-x-6">
            <Link to="/mentor" className="text-gray-600 hover:text-indigo-600">
              Mentor Dashboard
            </Link>
            <Link to="/student" className="text-gray-600 hover:text-indigo-600">
              Student Dashboard
            </Link>
          </div>

          {/* Sağ Kısım: Cüzdan Bağlantısı */}
          <div className="flex items-center space-x-4">
            {account ? (
              <span className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">
                {`${account.slice(0, 6)}...${account.slice(-4)}`}
              </span>
            ) : (
              <button
                onClick={connectWallet}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
