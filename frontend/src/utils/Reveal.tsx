import { useEffect, useRef } from "react";
import type { ElementType, ComponentPropsWithoutRef } from "react";

type RevealProps<T extends ElementType = "div"> = {
  as?: T;
  delay?: number;
  className?: string;
} & ComponentPropsWithoutRef<T>;

export default function Reveal<T extends ElementType = "div">({
  children,
  delay = 0,
  className = "",
  as,
  ...rest
}: RevealProps<T>) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "div") as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = [
      `opacity 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      `transform 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    ].join(", ");

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
