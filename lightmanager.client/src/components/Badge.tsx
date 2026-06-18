import React from "react";

type BadgeVariant = "default" | "active" | "priority1" | "priority2" | "priority3";

type Props = {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
    onClick?: () => void;
};

const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-slate-100 text-slate-700",
    active: "bg-green-100 text-green-700",
    priority1: "bg-red-100 text-red-700",
    priority2: "bg-yellow-100 text-yellow-700",
    priority3: "bg-blue-100 text-blue-700",
};

export default function Badge({children,variant = "default",className = "", onClick}: Props) {
    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${variantStyles[variant]} ${className}`} onClick={onClick}>
            {children}
        </span>
    );
}