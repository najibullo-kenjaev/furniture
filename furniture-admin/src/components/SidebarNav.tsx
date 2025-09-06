import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiBox,
  FiFolder,
  FiPhone,
  FiMenu,
  FiX,
} from 'react-icons/fi';

const items = [
  { to: '/', icon: <FiHome />, label: 'Дашборд' },
  { to: '/products', icon: <FiBox />, label: 'Товары' },
  { to: '/categories', icon: <FiFolder />, label: 'Категории' },
  { to: '/leads', icon: <FiPhone />, label: 'Заявки' },
];

export default function SidebarNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  /* close on route change (mobile) */
  useEffect(() => setOpen(false), [pathname]);

  /* close on ESC */
  useEffect(() => {
    const down = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      {/* hamburger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-lg ring-1 ring-black/5"
        aria-label="Toggle menu"
      >
        {open ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
      </button>

      {/* overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        />
      )}

      {/* drawer */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl
                    shadow-2xl ring-1 ring-black/5 flex flex-col transition-transform
                    ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="p-6">
          <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
            Furniture
          </h2>
        </div>

        <nav className="px-4 space-y-2">
          {items.map((i) => (
            <Link
              key={i.to}
              to={i.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                pathname === i.to
                  ? 'gradient-bg text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-800/20'
              }`}
            >
              <span className="text-lg">{i.icon}</span>
              <span>{i.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}