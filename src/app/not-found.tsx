// app/not-found.tsx (for App Router)
// or
// pages/404.tsx (for Pages Router)

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-500 to-purple-800 p-6">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center space-x-2 mb-6">
          <AlertCircle className="text-white w-12 h-12" />
          <h1 className="text-5xl font-extrabold text-gray-800">
            404
          </h1>
        </div>
        <p className="text-lg font-medium text-gray-900 mb-4">
          Sorry, the page you are looking for doesn&apos;t exist.
        </p>
        <p className="text-base text-white mb-8">
          It might have been moved or deleted. Make sure the URL is correct.
        </p>
        <div className="flex space-x-4">
          <Link href="/" passHref>
            <Button variant="secondary" className="text-lg font-semibold px-6 py-3">
              Go to Homepage
            </Button>
          </Link>
          <Link href="/contact" passHref>
            <Button variant="outline" className="text-lg font-semibold px-6 py-3">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
