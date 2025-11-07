import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { signOut } from 'next-auth/react'
import { mutate as globalMutate } from 'swr'
import useCurrentUser from '@/hooks/useCurrentUser'
import useLoginModal from '@/hooks/useLoginModal'

import { FaHome, FaShoppingCart, FaBox, FaUser, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa'
import SearchBar from './SearchBar'

interface NavbarProps {
    onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
    const router = useRouter()
    const { mutate: mutateCurrentUser } = useCurrentUser()
    const loginModal = useLoginModal()

    const showSearchBar = router.pathname === '/'
    const { user } = useCurrentUser()

    const handleNavigate = useCallback((path: string) => {
        router.push(path)
    }, [router])

    const handleLogout = useCallback(async () => {
       try {
            await signOut({ redirect: false })
            localStorage.removeItem('token')
            if (mutateCurrentUser) {
                await mutateCurrentUser()
            } else {
                await globalMutate('/api/users/me')
            }

            router.push('/')
        } catch (error) {
            console.log('Logout failed', error)
        }
    }, [router, mutateCurrentUser])

    return (
        <>
            <nav className="
                fixed
                left-1/2
                transform
                -translate-x-1/2
                bg-purple-900
                text-white
                backdrop-blur-md
                shadow-md
                border border-purple-900
                w-full
                mx-auto
                z-50
                gap-10
                flex
                items-center
                justify-between
                px-6 py-3">
                {/*The left side */}
                <div className="flex items-center gap-4">
                    <button onClick={() => handleNavigate('/')} aria-label='Home'>
                        <FaHome className="text-white text-xl hover:scale-110 transition"/>
                    </button>
                    <button onClick={() => handleNavigate('/general-cart')} aria-label='Cart'>
                        <FaShoppingCart className="text-white text-xl hover:scale-110 transition"/>
                    </button>
                    <button onClick={() => handleNavigate('/orders')} aria-label='Orders'>
                        <FaBox className="text-white text-xl hover:scale-110 transition"/>
                    </button>
                </div>

                {/*The middle side (search bar) */}
                <div className="flex-1 mx-4 hidden md:block">
                    {showSearchBar && <SearchBar onSearch={onSearch} />}
                </div>

                {/*The right side */}
                {user ? (
                    <div className="flex items-center gap-4">
                        <button onClick={() => handleNavigate('/profile')} aria-label='Profile'>
                            <FaUser className="text-white text-xl hover:scale-110 transition"/>
                        </button>
                        <button onClick={() => handleLogout()} aria-label='Logout'>
                            <FaSignOutAlt className="text-white text-xl hover:scale-110 transition"/>
                        </button> 
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <button onClick={loginModal.onOpen} aria-label="Login">
                            <FaSignInAlt className="text-white text-xl hover:scale-110 transition" />
                        </button>
                    </div>
                )}  
            </nav>
        </>
    )
}

export default Navbar
