interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className = "", children }: CardProps) {
  return (
    <div
      className={`rounded-2xl shadow-2xl w-full p-4 sm:p-8 ${className}`}
      style={{
        backgroundColor: "var(--primary)",
      }}
    >
      {children}
    </div>
  );
}
