// dialog and input and button
import Modal from "../Modal"
import Input from "../Input"

import useRegisterModal from "@/hooks/useRegisterModal"
import useLoginModal from "@/hooks/useLoginModal"
import { useState, useCallback } from "react"

import { signIn } from "next-auth/react"
import axios from 'axios'

const RegisterModal = () => {
    const registerModal = useRegisterModal()
    const loginModal = useLoginModal()

    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')

    const [isLoading, setIsLoading] = useState(false)

    const onToggle = useCallback(() => {
        if (isLoading) {
            return
        }

        registerModal.onClose()
        loginModal.onOpen()
    },[isLoading, registerModal, loginModal])

    const onSubmit = useCallback(async () => {
        try {
            setIsLoading(true)

            await axios.post('/api/register', {
                email,
                username,
                name,
                password
            })

            signIn('credentials', {
                email,
                password
            })

            registerModal.onClose()

        } catch (error) {
            console.log(error)

        } finally {
            setIsLoading(false)
        }
    }, [registerModal, email, username, name, password])

    const bodyContent = (
        <div>
            <Input 
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="name"
                disabled={isLoading}
            />
            <Input 
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="username"
                disabled={isLoading}
            />
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
            <p>Already have an account?</p>
            <span
                onClick={onToggle}
                className="
                    text-purple-900
                    cursor-pointer
                    hover:underline
                "
            >
                Sign in
            </span>
        </div>
    )

    return (
        <Modal 
            isOpen={registerModal.isOpen}
            onClose={registerModal.onClose}
            onSubmit={onSubmit}
            title="Create an account"
            body={bodyContent}
            footer={footerContent}
            actionLabel="Register"
            disabled={isLoading}
        />
    )
}

export default RegisterModal