import React, { useCallback } from "react"
import { useRouter } from "next/router";

interface RestaurantCardProps {
    id: string;
    name: string;
    address: string;
    category: string;
    rating: number;
    imageUrl: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ 
    id,
    name,
    address,
    category,
    rating,
    imageUrl
}) => {
    const router = useRouter();

    const goToDishes = useCallback(() => {
        router.push(`/restaurant/${id}`);
    }, [router, id])

    return (
        <div className="card card-border bg-base-100 w-96" onClick={() => goToDishes()}>
            <div className="card-body">
                <picture>
                    <img src={imageUrl} alt={name} />
                </picture>
                <h2 className="card-title">{name}</h2>
                <p>{address}</p>
                <p className="italic">{category}</p>
                <div className="rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <input
                            key={star}
                            type="radio"
                            name={`rating-${id}`}
                            className="mask mask-star bg-orange-400"
                            aria-label={`${star} star`}
                            defaultChecked={rating === star}
                            readOnly
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RestaurantCard;