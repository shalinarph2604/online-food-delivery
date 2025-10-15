import useTopUpModal from "@/hooks/useTopUpModal";
import { useState, useCallback } from "react"

import axios from "axios";
import { toast } from "react-hot-toast"

import Input from "../Input"
import Modal from "../Modal";

const TopUpModal = () => {
    const topUpModal = useTopUpModal()

    const [amount, setAmount] = useState("0")
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = useCallback(async () => {
        const numericAmount = Number(amount)

        try {
            setIsLoading(true)
            await axios.patch("/api/balance", numericAmount)

            topUpModal.onClose()

        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")

        } finally {
            setIsLoading(false)
        }

    }, [amount, topUpModal])

    const bodyContent = (
        <div>
            <Input 
                placeholder="Input amount"
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
                type="amount"
                disabled={isLoading}
            />
        </div>
    )

    const footerContent = (
        <div>
            <p>
                Please ensure the top up amount is correct before proceeding
            </p>
        </div>
    )
    
    return (
        <Modal 
            isOpen={topUpModal.isOpen}
            onClose={topUpModal.onClose}
            onSubmit={onSubmit}
            title="Top Up"
            body={bodyContent}
            footer={footerContent}
            actionLabel="Top Up"
            disabled={isLoading}
        />
    )
}

export default TopUpModal