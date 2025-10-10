import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { FaHome, FaShoppingCart, FaBox, FaUser, FaSignOutAlt } from 'react-icons/fa'
import SearchBar from './SearchBar'

const Navbar = () => {
    const router = useRouter()
    const showSearchBar = router.pathname === '/restaurant'

    const handleNavigate = useCallback((path: string) => {
        router.push(path)
    }, [router])

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token')
        router.push('/login')
    }, [router])

    return (
        <nav className="
            fixed
            bottom-4
            left-1/2
            transform
            -translate-x-1/2
            bg-purple-500
            text-white
            backdrop-blur-md
            shadow-md
            rounded-full
            border border-purple-300
            w-full max-w-6xl
            mx-auto
            z-50
            flex
            items-center
            justify-between
            px-6 py-3">
            {/*The left side */}
            <div className="flex items-center gap-4">
                <button onClick={() => handleNavigate('/restaurant')} aria-label='Home'>
                    <FaHome className="text-white text-xl hover:scale-110 transition"/>
                </button>
                <button onClick={() => handleNavigate('/cart')} aria-label='Cart'>
                    <FaShoppingCart className="text-white text-xl hover:scale-110 transition"/>
                </button>
                <button onClick={() => handleNavigate('/orders')} aria-label='Orders'>
                    <FaBox className="text-white text-xl hover:scale-110 transition"/>
                </button>
            </div>

            {/*The middle side (search bar) */}
            <div className="flex-1 mx-4 hidden md:block">
                {showSearchBar && <SearchBar />}
            </div>

            {/*The right side */}
            <div className="flex items-center gap-4">
                <button onClick={() => handleNavigate('/profile')} aria-label='Profile'>
                    <FaUser className="text-white text-xl hover:scale-110 transition"/>
                </button>
                <button onClick={() => handleLogout()} aria-label='Logout'>
                    <FaSignOutAlt className="text-white text-xl hover:scale-110 transition"/>
                </button>
            </div>
        </nav>
    )
}

export default Navbar