"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';

interface User {
  id: number;
  username: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    } else {
      try {
        const decodedToken = jwt.decode(token) as User;
        setUser(decodedToken);
      } catch (error) {
        console.error('Error decoding token:', error);
        Cookies.remove('token');
        router.push('/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Bienvenido, {user.username}!</p>
      <button
        onClick={handleLogout}
        className="bg-[#FF4500] hover:bg-[#FF6347] text-white font-bold py-2 px-4 rounded"
      >
        Cerrar sesión
      </button>
    </div>
  );
}