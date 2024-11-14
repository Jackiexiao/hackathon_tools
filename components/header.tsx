import Link from 'next/link';
import { Code2, Home, Trophy, Vote } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Code2 className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              周周黑客松
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/lucky-wheel"
              className="transition-colors hover:text-foreground/80 flex items-center space-x-2"
            >
              <Trophy className="h-4 w-4" />
              <span>Lucky Wheel</span>
            </Link>
            <Link
              href="/voting"
              className="transition-colors hover:text-foreground/80 flex items-center space-x-2"
            >
              <Vote className="h-4 w-4" />
              <span>Live Voting</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}