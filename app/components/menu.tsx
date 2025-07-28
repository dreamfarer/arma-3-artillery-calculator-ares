'use client';
import { ReactNode } from 'react';
import styles from './menu.module.css';
import { useMenuState } from '../context/menu-state-context';

type Props = {
  children: ReactNode;
};

export default function Menu({ children }: Props) {
  const { isMenuOpen } = useMenuState();
  return (
    <div className={`${styles.menu} ${!isMenuOpen ? styles.closed : ''}`}>
      {children}
    </div>
  );
}
