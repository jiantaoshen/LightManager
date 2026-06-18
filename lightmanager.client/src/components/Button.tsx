import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "ghost";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    disabled?: boolean;
    variant?: ButtonVariant;
    className?: string;
};

export default function Button({children,onClick,type = "button",disabled = false,variant = "primary",className = ""}: ButtonProps) {

    const base = "px-4 py-2 rounded-md font-medium transition flex items-center justify-center";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300",
        danger: "bg-red-600 text-white hover:bg-red-700",
        success: "bg-green-600 text-white hover:bg-green-700",
        ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
        >
            {children}
        </button>
    );
}