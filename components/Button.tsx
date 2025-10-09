// ambil dari ui/button.tsx
interface ButtonProps {
    label: string;
    primary: string;
    secondary?: boolean;
    disabled?: boolean;
    small?: boolean;
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
                ${small ? 'w-6 h-6 px-0 py-0 rounded-md': 'min-w-[216px] h-11 px-6 rounded-full'}
            `}
        >
            {label}
        </button>
    )
}

export default Button