import React, { useCallback } from "react"
import { useRouter } from "next/router";
import Image from "next/image";

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

// function to render stars based on rating
    const renderStars = () => {
        const stars = []
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5
    
    // full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <svg
                    key={`full-${i}`}
                    className="w-5 h-5 fill-orange-400"
                    viewBox="0 0 20 20"
                >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
            )
        }

    // half star
        if (hasHalfStar) {
            stars.push(
                <div key="half" className="relative w-5 h-5">
                    {/* Background: bintang abu-abu */}
                    <svg className="absolute w-5 h-5 fill-gray-300" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    {/* Foreground: setengah bintang orange (dipotong) */}
                    <svg className="absolute w-5 h-5" viewBox="0 0 20 20" style={{ clipPath: 'inset(0 50% 0 0)' }}>
                        <path className="fill-orange-400" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                </div>
            )
        }

    // empyy stars
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
        for (let i = 0; i < emptyStars; i++) {
            <svg
                key={`empty-${i}`}
                className="w-5 h-5 fill-gray-300"
                viewBox="0 0 20 20"
            >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
        }

        return stars
    }

    return (
        <div 
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
            onClick={goToDishes}
        >
            {/* Image */}
            <div className="relative h-48 w-full">
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                />
            </div>

            {/* Content */}
            <div className="p-4">
                <h2 className="text-xl font-bold mb-2 truncate">{name}</h2>
                <p className="text-gray-600 text-sm mb-1 truncate">{address}</p>
                <p className="text-gray-500 text-sm italic mb-3">{category}</p>
                
                {/* Rating Display */}
                <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                        {renderStars()}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                        {rating.toFixed(1)}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default RestaurantCard;