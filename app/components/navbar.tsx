'use client';

import Image from 'next/image';
import styles from './navbar.module.css';
import Group from './navbar/group';
import { ListDashesIcon, CaretLeftIcon } from '@phosphor-icons/react';
import Link from 'next/link';
import { useMenuState } from '../context/menu-state-context';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function Navbar() {
  const { isMenuOpen, toggleMenu, setActiveMenuName } = useMenuState();
  const segment = usePathname().split('/').filter(Boolean).pop() ?? 'filter';

  useEffect(() => {
    setActiveMenuName(segment);
  }, [segment, setActiveMenuName]);

  return (
    <div className={styles.navbar}>
      <Group>
        <Link
          href="/artillery"
          scroll={false}
          className={`${styles.button} ${styles.logo}`}
          aria-label="Home"
        >
          <Image loading="lazy" fill alt="Logo" src="/logo.svg" />
        </Link>

        <Link
          href="/artillery"
          scroll={false}
          className={`${styles.button} ${
            segment === 'filter' ? styles.inactive : styles.active
          }`}
          aria-label="Show filter"
        >
          <ListDashesIcon size="2em" />
        </Link>
      </Group>

      <Group>
        <button
          onClick={toggleMenu}
          className={`${styles.caret} ${
            !isMenuOpen ? styles.inactive : styles.active
          }`}
          aria-label={isMenuOpen ? 'Hide menu' : 'Show menu'}
        >
          <CaretLeftIcon size="2em" className="" />
        </button>
      </Group>
    </div>
  );
}
