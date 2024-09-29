import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-5xl font-bold text-red-500">404 - Not Found</h2>
      <p className="mt-4 text-xl text-gray-700">
        We couldn't find the page you're looking for.
      </p>
      <p className="text-gray-600 mt-2">It may have been removed or the link is incorrect.</p>
      <Link href="/">
        <div className="mt-6 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
          Back to Home
        </div>
      </Link>
    </div>
  );
}
