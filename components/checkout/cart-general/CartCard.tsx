import useCartGeneral from "@/hooks/useCartGeneral";
import { useCallback } from "react";
import Button from "../Button";

interface CartCardData {
    id: string
    user_id: string
    dish_id: string
    quantity: number
    notes: string | null
    total_price: string
    restaurant_id: string
    restaurant?: {
        name: string,
        address: string
    }
}