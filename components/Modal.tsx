import React, { useCallback, useEffect } from 'react'
import Button from './Button'
import { AiOutlineClose } from 'react-icons/ai'

interface ModalProps {
    isOpen?: boolean
    onClose: () => void
    onSubmit: () => void
    title?: string
    body?: React.ReactElement
    footer?: React.ReactElement
    actionLabel: string
    disabled?: boolean
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    body,
    footer,
    actionLabel,
    disabled,
}) => {
    const handleClose = useCallback(() => {
        if (disabled) {
            return
        }
        onClose()
    }, [disabled, onClose])

    const handleSubmit = useCallback(() => {
        if (disabled) {
            return
        }
        onSubmit()
    }, [disabled, onSubmit])

// Close modal on ESC button press
    useEffect(() => {
        const handleEscButton = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose()
            }
        }
        document.addEventListener('keydown', handleEscButton)
        return () => document.removeEventListener('keydown', handleEscButton)
    }, [handleClose])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } 

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) {
        return null
    }

    return (
        <>
            <div 
                className="
                    fixed
                    inset-0
                    z-[100]
                    flex
                    items-center
                    justify-center
                    bg-black/50
                    px-4
                "
                onClick={handleClose}
            >
                <div
                    className="
                        relative
                        w-full
                        max-w-md
                        bg-white
                        rounded-2xl
                        shadow-2xl
                        animate-slideUp
                    "
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* HEADER */}
                    <div className="
                        flex
                        items-center
                        justify-between
                        p-6
                        border-b
                        border-gray-200
                    ">
                        <h2 className="text-lg font-bold text-gray-900">
                            {title}
                        </h2>
                        <button 
                            onClick={handleClose}
                            className="
                                p-2
                                rounded-full
                                hover:bg-gray-100
                                transition
                                disabled:cursor-not-allowed
                                disabled:opacity-50"
                            aria-label="Close Modal"
                        >
                            <AiOutlineClose size={20} />
                        </button>
                    </div>

                    {/* BODY */}
                    <div className="p-6">
                        {body}
                    </div>

                    {/* FOOTER */}
                    <div className="p-6 pt-0 space-y-4">
                        <Button
                            label={actionLabel}
                            onClick={handleSubmit}
                            disabled={disabled}
                            primary
                        />
                        {footer && (
                            <div className="text-center text-sm">
                                {footer}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal