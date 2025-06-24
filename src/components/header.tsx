import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export default function Header() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto border-b px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold"
            >
              ToDoList
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="https://github.com/jackaranaram/backend-todolist" target="_blank" rel="noreferrer">
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="ghost" className="text-sm cursor-pointer">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="text-sm hover:opacity-90 cursor-pointer">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
