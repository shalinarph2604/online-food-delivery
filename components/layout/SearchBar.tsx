import { useState } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
    onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [search, setSearch] = useState('')
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch?.(search)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearch(value)
        onSearch?.(value)
    }

    return (
        <form onSubmit={handleSearch} className="flex items-center relative gap-4">
            <div className="relative flex-1">
                <input
                    type="text"
                    value={search}
                    onChange={handleChange}
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

                {/* handle clear search,
                the X button only visible when the input is not empty */}
                {search && (
                    <button 
                        type="button"
                        onClick={() => { setSearch(''); onSearch?.('') }}
                        aria-label="clear search"
                        className="
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            text-gray-400
                            hover:text-gray-600
                            transition
                        "
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
            <button
                type="submit"
                aria-label="search restaurant"
                className="
                    bg-purple-900
                    hover:bg-purple-700
                    text-white
                    p-3
                    rounded-lg
                    transition
                    shadow-sm
                    hover:shadow-md
                    flex
                    items-center
                    justify-center
                ">
                <Search size={24} />
            </button>
        </form>
    )
}

export default SearchBar