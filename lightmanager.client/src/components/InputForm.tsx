type Props = {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    className?: string;
};

export default function Input({label,value,onChange,type = "text",placeholder = "",className = ""}: Props) {
    return (
        <div>
            {label && (
                <label>
                    {label}
                </label>
            )}

            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full rounded border px-3 py-2 ${className}`}
            />
        </div>
    );
}