import { ReactNode } from "react";

export default function LandingPageCard({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex justify-center mt-10">
      <div className="w-[80vw] bg-[#80B9E8] rounded-3xl p-6 shadow-md">
        {children}
      </div>
    </div>
  );
}
