/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";

const useTopUp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const topUp = async (userId: string, amount: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post("/api/topup", { userId, amount });
            return response.data;
        } catch (error: any) {
            setError(error.response?.data?.message || "Top-up failed");
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, topUp };
};

export default useTopUp;