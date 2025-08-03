// pages/register/login.tsx
"use client"; // Pastikan ini ada jika Anda menggunakan App Router

import React, { useState, FC, ChangeEvent, FormEvent } from 'react';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { useRouter } from 'next/router'; // useRouter dari next/router

// Menghapus impor ikon sosial karena tidak digunakan lagi
// import { FaFacebookF, FaTwitter, FaGoogle } from 'react-icons/fa';

const LoginPage: FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Handler untuk submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!username || !password) {
      setError('Username dan Password harus diisi.');
      setLoading(false);
      return;
    }

    try {
      // Kirim request login
      // PERHATIAN: Endpoint ini adalah IP lokal. Pastikan ini sesuai dengan server API Anda.
      const loginResponse: Response = await fetch('http://192.168.236.15:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Penting untuk cookies/sesi
      });

      // Tipekan data respons yang diharapkan dari API login
      interface LoginResponseData {
        message: string;
        token?: string; // Token bisa opsional tergantung API Anda
        // Tambahkan properti lain yang mungkin ada di respons API
      }

      const loginData: LoginResponseData = await loginResponse.json();

      if (!loginResponse.ok) {
        // Jika respons tidak OK, lempar error dengan pesan dari API
        throw new Error(loginData.message || 'Login gagal.');
      }

      // ✅ Login sukses
      setSuccess(`Login Berhasil! Selamat datang.`);
      setUsername('');
      setPassword('');
      setError('');

      // Arahkan ke dashboard setelah login berhasil
      router.push('/dashboard');

    } catch (err: any) { // Gunakan 'any' untuk error atau tipekan lebih spesifik jika dikenal
      // Tangani error dari fetch atau dari throw new Error
      setError(err.message || 'Terjadi kesalahan tidak terduga saat login.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-3xl"> {/* Ukuran container lebih kecil */}
        {/* Konten Form Login (Sisi Kiri) */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center"> {/* Padding lebih kecil */}
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight"> {/* Ukuran font lebih kecil */}
            Sign in
          </h2>
          <p className="text-gray-500 text-xs mb-6"> {/* Ukuran font dan margin lebih kecil */}
            Dapatkan akses ke fitur-fitur admin Anda.
          </p>

          {error && (
            <p className="text-red-600 text-center text-xs font-medium mb-3 p-2 bg-red-50 rounded-lg animate-fade-in"> {/* Ukuran font dan padding lebih kecil */}
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-600 text-center text-xs font-medium mb-3 p-2 bg-green-50 rounded-lg animate-fade-in"> {/* Ukuran font dan padding lebih kecil */}
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4"> {/* Spasi lebih rapat */}
            {/* Username Input */}
            <div className="relative">
              <label htmlFor="username" className="block text-xs font-medium text-gray-700"> {/* Ukuran font lebih kecil */}
                Username
              </label>
              <div className="mt-1 flex items-center bg-white border border-gray-300 rounded-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <span className="px-2 text-gray-400">
                  <FaUserAlt className="w-3 h-3" /> {/* Ukuran ikon lebih kecil */}
                </span>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  required
                  className="w-full px-2 py-2 bg-transparent text-black placeholder-gray-500 rounded-r-md focus:outline-none text-xs" // Ukuran font dan padding lebih kecil
                  placeholder="Masukkan username Anda"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="block text-xs font-medium text-gray-700"> {/* Ukuran font lebih kecil */}
                Password
              </label>
              <div className="mt-1 flex items-center bg-white border border-gray-300 rounded-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <span className="px-2 text-gray-400">
                  <FaLock className="w-3 h-3" /> {/* Ukuran ikon lebih kecil */}
                </span>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                  className="w-full px-2 py-2 bg-transparent text-black placeholder-gray-500 rounded-r-md focus:outline-none text-xs" // Ukuran font dan padding lebih kecil
                  placeholder="Masukkan password Anda"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs"> {/* Ukuran font lebih kecil */}
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="remember-me" className="ml-1.5 block text-gray-900">
                  Ingat Saya
                </label>
              </div>
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Lupa Password?
              </a>
            </div>

            {/* Tombol Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md shadow-sm hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs" // Ukuran font dan padding lebih kecil
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-1.5">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span>Memproses...</span>
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Menghapus bagian Social Login Buttons */}
        </div>

        {/* Konten Gambar (Sisi Kanan) */}
        <div className="hidden md:block md:w-1/2 relative bg-gray-50">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1622396347317-a06803730e46?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Seorang wanita berjalan di jalanan kota"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
