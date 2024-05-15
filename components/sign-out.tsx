"use client"
import { destroyCookie } from 'nookies';
import { fireAuth } from './provider';
import { LuLogOut } from "react-icons/lu";
import { useCallback, useEffect } from 'react';

const SignOut = () => {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await fireAuth.signOut();
        console.log('User signed out successfully');
        destroyCookie(null, 'token');
        redirectToHome();
      } catch (error) {
        console.error('Error signing out:', error);

      }
    };

    const redirectToHome = () => {
      window.location.href = '/'; 
    };

    const handleClick = () => {
      handleLogout();
    };

    const button = document.getElementById('logout-button');
    if (button) {
      button.addEventListener('click', handleClick);
    }

    return () => {
      if (button) {
        button.removeEventListener('click', handleClick);
      }
    };
  }, []);

  return (
    <button id="logout-button" className='rounded-full p-2 bg-[#A5BE00] border border-[#A5BE00] text-white hover:text-[#A5BE00] hover:bg-white'>
      <LuLogOut />
    </button>
  );
};



export default SignOut;