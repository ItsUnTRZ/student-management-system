// Search Bar Component
// ไฟล์นี้สร้างช่องค้นหานักศึกษาแบบ real-time

'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { Search, X } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  debounceMs?: number
}

// Component สำหรับช่องค้นหา
const SearchBar: React.FC<SearchBarProps> = memo(({
  onSearch,
  placeholder = 'ค้นหานักศึกษา...',
  debounceMs = 300,
}) => {
  const [query, setQuery] = useState('')

  // ใช้ debounce เพื่อลดการเรียก API
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, onSearch, debounceMs])

  // ฟังก์ชันสำหรับล้างการค้นหา
  const handleClear = useCallback(() => {
    setQuery('')
    onSearch('')
  }, [onSearch])

  return (
    <div className="relative">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        leftIcon={<Search className="w-4 h-4" />}
        rightIcon={
          query && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )
        }
      />
    </div>
  )
})

SearchBar.displayName = 'SearchBar'

export default SearchBar
