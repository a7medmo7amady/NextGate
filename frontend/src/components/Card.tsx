interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className = "", children }: CardProps) {
  return (
    <div
      className={`rounded-2xl shadow-2xl w-full p-4 sm:p-8 ${className}`}
      style={{
        backgroundColor: "var(--background)",
        border: "1px solid color-mix(in srgb, var(--primary) 20%, transparent)",
      }}
    >
      {children}
    </div>
  );
}
