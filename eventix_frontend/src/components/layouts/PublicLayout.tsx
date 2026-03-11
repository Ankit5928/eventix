import { Outlet, Link } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { RootState } from '../../store';
import { Button } from '../ui/Button';

export default function PublicLayout() {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen flex flex-col pt-16">
      {/* Sticky, Transparent Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto h-16 flex items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              Eventix
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button asChild variant="default" size="sm">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link to="/login">Sign In</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Simple Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Eventix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
