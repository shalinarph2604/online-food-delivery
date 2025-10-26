import axios from 'axios'

export const getCart = async (restaurantId: string) => {
    const get = await axios.get(`/api/restaurant/${restaurantId}/cart`)
    return get.data
}

export const addToCart = async (
    restaurantId: string,
    item: { dishId: string, quantity: number, notes?: string }
) => {
    const post = await axios.post(`api/restaurant/${restaurantId}/cart`, item)
    return post.data
}

export const removeFromCart = async (
    restaurantId: string,
    itemId: string
) => {
    const del = await axios.delete(`/api/restaurant/${restaurantId}/cart/${itemId}`)

    return del.data
}