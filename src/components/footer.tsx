'use client'

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="max-h-20 fixed bottom-0 left-0 right-0">
      <div className="container border-t mx-auto flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Developed with Next.js by Jack Arana. All rights reserved.
        </p>

        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="https://www.linkedin.com/in/jackaranaram/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="https://github.com/jackaranaram/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="https://arackdev.web.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Arack
          </Link>
        </nav>
      </div>
    </footer>
  );
}
