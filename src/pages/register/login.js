import { useState, useEffect } from 'react';
import { FaUserAlt, FaLock, FaSyncAlt } from 'react-icons/fa';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCaptcha, setGeneratedCaptcha] = useState(null);

  function generateCaptcha() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  useEffect(() => {
    if (generatedCaptcha === null) {
      // setGeneratedCaptcha(generateCaptcha());
    }
  }, [generatedCaptcha]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
  
    if (!username || !password) {
      setError('Username dan Password harus diisi.');
      setLoading(false);
      return;
    }
  
    // if (generatedCaptcha && captcha && captcha.toLowerCase() !== generatedCaptcha.toLowerCase()) {
    //   setError('CAPTCHA salah. Silakan coba lagi.');
    //   setGeneratedCaptcha(generateCaptcha());
    //   setLoading(false);
    //   return;
    // }
  
    try {

      // 1. Kirim request login
      const loginResponse = await fetch('http://192.168.236.15:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
  
      const loginData = await loginResponse.json();
  
      if (!loginResponse.ok) {
        throw new Error(loginData.message || 'Login gagal.');
      }
  
      const token = loginData.token;
  
      // 2. Ambil data user
      // const userResponse = await fetch('http://192.168.236.15:3000/api/user', { 
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });
  
      // const userData = await userResponse.json();
  
      // if (!userResponse.ok) {
      //   throw new Error(userData.message || 'Gagal mengambil data user.');
      // }
  
      // ✅ Login sukses
      setSuccess(`Login Berhasil! Selamat datang.`);
      setUsername('');
      setPassword('');
      setCaptcha('');
      setGeneratedCaptcha(generateCaptcha());
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
      setGeneratedCaptcha(generateCaptcha());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="box-border relative w-[90%] max-w-[320px] bg-white px-5 pt-[10px] pb-20 rounded-t-[2px] rounded-b-[5px] shadow-[0px_1px_5px_rgba(0,0,0,0.3)]"

      >
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6 tracking-wide">
          Login
        </h2>

        {error && (
          <p className="text-red-600 text-center text-sm font-semibold animate-shake">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-center text-sm font-semibold">
            {success}
          </p>
        )}

        {/* Username */}
        <div className="relative">
          <label htmlFor="username" className="block text-gray-700 text-sm font-semibold mb-2">
            Username
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-500 transition">
            <span className="pl-3 text-gray-400">
              <FaUserAlt />
            </span>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-r-lg focus:outline-none bg-transparent"
              placeholder="Masukkan username Anda"
            />
          </div>
        </div>

        {/* Password */}
        <div className="relative">
          <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
            Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-500 transition">
            <span className="pl-3 text-gray-400">
              <FaLock />
            </span>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-r-lg focus:outline-none bg-transparent"
              placeholder="Masukkan password Anda"
            />
          </div>
        </div>

        {/* CAPTCHA */}
        <div>
          <label htmlFor="captcha" className="block text-gray-700 font-semibold mb-2">
            CAPTCHA (Opsional)
          </label>
          <div className="flex items-center mb-2 space-x-3">
            <div className="flex-1 bg-gray-200 font-mono tracking-widest text-gray-700 text-sm rounded-lg py-3 px-5 select-none text-center shadow-inner">
              {generatedCaptcha || 'Loading...'}
            </div>
            <button
              type="button"
              onClick={() => setGeneratedCaptcha(generateCaptcha())}
              className="flex items-center text-blue-600 hover:text-blue-800 transition font-semibold space-x-1"
              aria-label="Refresh CAPTCHA"
              title="Refresh CAPTCHA"
            >
              <FaSyncAlt />
              <span>Refresh</span>
            </button>
          </div>
          <input
            type="text"
            id="captcha"
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
            placeholder="Masukkan kode CAPTCHA"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-10 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg shadow-lg transition duration-300"

        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mx-auto text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            'Login'
          )}
        </button>
      </form>
    </div>
  );
}
