'use client'

import { useState } from 'react'
import Link from 'next/link'

interface HeaderProps {
  currentPage: 'flights' | 'hotels' | 'airbnb'
}

const pages = [
  { id: 'flights', label: 'Flight Deals', href: '/', icon: '✈️' },
  { id: 'hotels', label: 'Hotel Deals', href: '/hotel-deals', icon: '🏨' },
  { id: 'airbnb', label: 'Airbnb Deals', href: '/airbnb-deals', icon: '🏠' },
]

export default function Header({ currentPage }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const current = pages.find(p => p.id === currentPage) || pages[0]

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/">
              <h1 className="text-3xl font-bold text-gray-900">
                {current.icon} <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Nomad</span>
              </h1>
            </Link>
          </div>

          {/* Dropdown Navigation */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium text-gray-700"
            >
              <span>{current.icon}</span>
              <span>{current.label}</span>
              <svg
                className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  {pages.map((page) => (
                    <Link
                      key={page.id}
                      href={page.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors ${
                        currentPage === page.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <span>{page.icon}</span>
                      <span>{page.label}</span>
                      {currentPage === page.id && (
                        <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
