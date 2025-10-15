// ini simple aja, dialog sama input aja, sama button paling
import Modal from "../Modal";
import Input from "../Input";

import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import { useState, useCallback } from "react";

import { signIn } from "next-auth/react";

const LoginModal = () => {
    const loginModal = useLoginModal()
    const registerModal = useRegisterModal()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const onToggle = useCallback(() => {
        if (isLoading) {
            return
        }

        loginModal.onClose()
        registerModal.onOpen()

    }, [isLoading, loginModal, registerModal])

    const onSubmit = useCallback(async () => {
        try {
            setIsLoading(true)

            await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            loginModal.onClose()
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    }, [email, password, loginModal])

    const bodyContent = (
        <div>
            <Input 
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                disabled={isLoading}
            />
            <Input 
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                disabled={isLoading}
                
            />
        </div>
    )
    
    const footerContent = (
        <div>
            <p>Did not have an account?</p>
            <span
                onClick={onToggle}
                className="
                    text-purple-900 
                    cursor-pointer
                    hover:underline
                "
            >
                Create an account
            </span>
        </div>
    )

    return (
        <Modal 
            isOpen={loginModal.isOpen}
            onClose={loginModal.onClose}
            onSubmit={onSubmit}
            title="Login"
            body={bodyContent}
            footer={footerContent}
            actionLabel="Sign in"
            disabled={isLoading}
        />
    )
}

export default LoginModal