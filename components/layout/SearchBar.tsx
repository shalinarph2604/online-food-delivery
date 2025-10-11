import { useRouter } from 'next/router'
import { useState } from 'react'
import { Search } from 'lucide-react'

const SearchBar = () => {
    const router = useRouter()
    const [search, setSearch] = useState('')
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (search.trim() === '') return
        router.push(`/search?query=${search}`)
    }

    return (
        <form onSubmit={handleSearch} className="flex items-center relative gap-4">
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for restaurant..."
                className="
                    rounded-lg
                    w-full
                    border
                    border-purple-300
                    bg-white
                    py-2.5 pl-4 pr-10
                    text-gray-700
                    placeholder-gray-400
                    shadow-sm
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-400
                    focus:outline-none
                    transition
                    "
            />
            <button type="submit" aria-label="search-restaurant" className="
                relative
                top-3
                -translate-y-1/2
                text-white hover:text-purple-600 transition">
                <Search size={24} />
            </button>
        </form>
    )
}

export default SearchBar