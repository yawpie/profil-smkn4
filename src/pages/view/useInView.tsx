import { useState, useEffect, useRef, RefObject } from 'react';
import type { IntersectionObserverOptions } from '@/types/View';

export default function useInView(options?: IntersectionObserverOptions): [RefObject<HTMLElement | null>, boolean] {
  const [inView, setInView] = useState<boolean>(false);
  const ref = useRef<HTMLElement | null>(null); // Refs bisa null pada awalnya

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
      setInView(entry.isIntersecting);
    }, options);

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, inView];
}
