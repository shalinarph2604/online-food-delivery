// ambil dari ui/button.tsx
interface ButtonProps {
    label: string;
    primary: string;
    secondary?: boolean;
    disabled?: boolean;
    large?: boolean;
    onClick: () => void
}

const Button: React.FC<ButtonProps> = ({
    label,
    primary,
    secondary,
    disabled,
    small,
    onClick
}) => {
    return (
        <button 
            disabled={disabled}
            onClick={onClick}
            className={`
                disabled:opacity-70
                disabled:cursor-not-allowed
                hover: opacity-80
                transition
                border-2
                rounded-full
                ${primary ? 'bg-purple-500 text-white border-purple-500' : ''}
                ${secondary ? 'bg-white text-purple-500 border-purple-500' : ''}
            `}
        >
            {label}
        </button>
    )
}

export default Button