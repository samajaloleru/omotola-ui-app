import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

import logo from '../assets/images/logo.png';
import omotolaLogo from '../assets/images/omotola_logo.png';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-plum-50 text-plum' : 'text-muted hover:bg-sand hover:text-ink'
  }`;

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="grain relative flex min-h-[100dvh] flex-col">
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
      Skip to content
    </a>

    <header className="sticky top-0 z-40 border-b border-line/70 bg-ivory/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-3">
          <img src={logo} alt="Celestial Church of Christ" className="h-9 w-auto" />
          <span className="hidden leading-tight sm:block">
            <span className="block font-serif text-[15px] font-semibold text-ink">Omotola Cathedral</span>
            <span className="block text-xs text-muted">Member portal</span>
          </span>
        </NavLink>
        <nav className="flex items-center gap-1" aria-label="Main">
          <NavLink to="/" end className={navLinkClass}>Portal</NavLink>
          <NavLink to="/members" className={navLinkClass}>Directory</NavLink>
        </nav>
      </div>
    </header>

    <main id="main" className="relative z-10 flex flex-1 flex-col">
      {children}
    </main>

    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted sm:flex-row sm:px-6">
        <div className="flex items-center gap-3">
          <img src={omotolaLogo} alt="Omotola Cathedral" className="h-8 w-auto" />
          <span>C.C.C. Omotola Cathedral</span>
        </div>
        <span>© {new Date().getFullYear()} · Member records are kept private</span>
      </div>
    </footer>
  </div>
);

export default Layout;
