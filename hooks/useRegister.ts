/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";

const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (name: string, email: string, username: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post("/api/register", { name, email, username, password });
            return response.data;
        } catch (error: any) {
            setError(error.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return { register, isLoading, error };
};

export default useRegister;
