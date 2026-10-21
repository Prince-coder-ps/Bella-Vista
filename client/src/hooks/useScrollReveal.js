import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref to attach to any element and a boolean that flips to true
 * once the element scrolls into the viewport. Pairs with Framer Motion's
 * `animate={inView ? 'visible' : 'hidden'}` for scroll-triggered animation.
 */
export default function useScrollReveal({ threshold = 0.15, once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, inView];
}
