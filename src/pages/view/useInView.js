// hooks/useInView.js
import { useState, useEffect, useRef } from 'react';

export default function useInView(options) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Jika ingin animasi hanya sekali saat muncul:
      // if (entry.isIntersecting && !inView) {
      //   setInView(true);
      // }
      // Jika ingin animasi berulang setiap kali masuk/keluar viewport:
      setInView(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options, inView]); // Tambahkan inView ke dependency array jika menggunakan logika 'sekali' di atas

  return [ref, inView];
}