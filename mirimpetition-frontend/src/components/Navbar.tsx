import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { useMirimOAuth } from 'mirim-oauth-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { logIn, logOut, isLoggedIn } = useMirimOAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  async function handleLogout() {
    try {
      await logOut();
      setIsOpen(false);
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  }

  async function handleLogin() {
    try {
      await logIn();
      setIsOpen(false);
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
    }
  }

  useEffect(() => {
    setIsOpen(false);

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const navLinks = [
    { name: '홈', href: '/' },
    { name: '청원 목록', href: '/petitions' },
    { name: '자주 묻는 질문', href: '/faq' },
    { name: '공지사항', href: '/notices' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-40 transition-all duration-300',
        {
          'glass py-3 card-shadow': isOpen || scrolled,
          'bg-transparent py-5': !isOpen && !scrolled,
          'md:glass md:py-3 md:card-shadow': scrolled,
          'md:bg-transparent md:py-5': !scrolled,
        }
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold text-primary animate-fade-in"
          >
            미림청원
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <div className="hidden md:flex items-center space-x-1 mr-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'text-primary'
                      : 'text-foreground/80 hover:text-primary'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <ThemeToggle />

            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                className="hidden md:inline-flex"
                onClick={() => {
                  handleLogout();
                }}
              >
                로그아웃
              </Button>
            ) : (
              <Button onClick={handleLogin} className="ml-2">
                로그인
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="md:hidden rounded-full"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </nav>

        {isOpen && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'px-4 py-3 rounded-md text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'bg-secondary text-primary'
                      : 'text-foreground/80 hover:bg-secondary hover:text-primary'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:inline-flex"
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  로그아웃
                </Button>
              ) : (
                <Button onClick={handleLogin} className="ml-2">
                  로그인
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

