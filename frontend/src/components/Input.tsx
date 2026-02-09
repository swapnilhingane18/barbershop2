/**
 * Input Component
 * Reusable input field with validation support
 */

interface InputProps {
    label?: string;
    type?: 'text' | 'tel' | 'email' | 'number' | 'date' | 'time';
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    disabled?: boolean;
    min?: string;
    className?: string;
}

export const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    error,
    disabled = false,
    min,
    className = '',
}: InputProps) => {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                min={min}
                className={`px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
            />
            {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
    );
};
