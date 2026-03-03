import Link from 'next/link'
import React from 'react'

function DashboardSidebar() {
  return (
    <div>   <nav className="flex-1 px-4 space-y-2">
              <Link href="/dashboard" className="block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                Dashboard
              </Link>

            </nav>
            </div>
  )
}

export default DashboardSidebar