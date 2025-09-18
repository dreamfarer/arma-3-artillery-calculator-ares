'use client';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type TMenuStateContext = {
  isMenuOpen: boolean;
  activeMenuName: string;
  toggleMenu: () => void;
  setMenuOpen: (open: boolean) => void;
  setActiveMenuName: (activeMenuName: string) => void;
};

const MenuStateContext = createContext<TMenuStateContext | null>(null);

export function MenuStateProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuName, setActiveMenuName] = useState('settings');

  const contextValue = useMemo<TMenuStateContext>(
    () => ({
      isMenuOpen,
      activeMenuName,
      toggleMenu: () => setIsMenuOpen((v) => !v),
      setMenuOpen: (v: boolean) => setIsMenuOpen(v),
      setActiveMenuName: (v: string) => setActiveMenuName(v),
    }),
    [isMenuOpen, activeMenuName]
  );

  return (
    <MenuStateContext.Provider value={contextValue}>
      {children}
    </MenuStateContext.Provider>
  );
}

export function useMenuState() {
  const context = useContext(MenuStateContext);
  if (!context)
    throw new Error('useMenuState must be used inside <MenuStateProvider>');
  return context;
}
