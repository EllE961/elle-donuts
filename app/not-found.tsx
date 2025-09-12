import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="text-center px-6">
        <h1 className="text-9xl font-bold text-pink-400 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}