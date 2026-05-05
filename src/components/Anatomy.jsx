import React from "react";

// 🔥 1. BUTTON COMPONENT (Natural & Semantic)
export const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "bg-[#5D5FEF] text-white hover:shadow-[0_10px_20px_rgba(93,95,239,0.3)]",
    secondary: "bg-[#F4F7FE] text-[#1B254B] hover:bg-[#E9EDF7]",
    outline: "border-2 border-[#E9EDF7] text-[#1B254B] hover:bg-[#F4F7FE]",
    danger: "bg-[#EE5D50] text-white hover:shadow-[0_10px_20px_rgba(238,93,80,0.3)]",
  };

  return (
    <button
      className={`px-6 py-3 rounded-2xl text-sm font-black transition-all active:scale-95 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// 🔥 2. INPUT FIELD (Natural Style)
export const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-2 w-full">
    {label && (
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A3AED0] ml-2">
        {label}
      </label>
    )}
    <input
      className="bg-[#F4F7FE] border-2 border-transparent focus:border-[#5D5FEF] focus:bg-white px-5 py-3.5 rounded-2xl text-sm font-bold text-[#1B254B] outline-none transition-all placeholder:text-[#A3AED0]"
      {...props}
    />
  </div>
);

// 🔥 3. BADGE (Semantic Status)
export const Badge = ({ children, status = "success" }) => {
  const styles = {
    success: "bg-[#05CD99]/10 text-[#05CD99]",
    warning: "bg-[#FFB547]/10 text-[#FFB547]",
    danger: "bg-[#EE5D50]/10 text-[#EE5D50]",
    primary: "bg-[#5D5FEF]/10 text-[#5D5FEF]",
  };

  return (
    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
      {children}
    </span>
  );
};

// 🔥 4. CARD (Natural Surface)
export const Card = ({ children, title, subtitle, className = "" }) => (
  <div className={`bg-white p-8 rounded-[2.5rem] shadow-[0px_18px_40px_rgba(112,144,176,0.08)] ${className}`}>
    {(title || subtitle) && (
      <div className="mb-6">
        {title && <h3 className="text-lg font-black text-[#1B254B] tracking-tight">{title}</h3>}
        {subtitle && <p className="text-xs font-semibold text-[#A3AED0]">{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);

// 🔥 5. TABLE COMPONENT
export const Table = ({ headers, children }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="text-[#A3AED0] text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-50">
          {headers.map((h, i) => (
            <th key={i} className="pb-5 font-black">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50 text-sm font-bold text-[#1B254B]">
        {children}
      </tbody>
    </table>
  </div>
);