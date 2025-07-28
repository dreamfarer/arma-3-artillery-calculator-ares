'use client';
import type { NextPage } from 'next';
import styles from './settings.module.css';
import Menu from './menu';
// import { useEffect, useState } from 'react';
// import { useElevation } from '../hooks/use-elevation';

const Bookmarks: NextPage = () => {
  /*
  const getElevation = useElevation();
  const [elevation, setElevation] = useState<number | null>(null);
  useEffect(() => {
    getElevation(21085, 19635).then(setElevation);
  }, [getElevation]);
  */

  return (
    <Menu>
      <div className={styles.scrollArea}>
        <div className={styles.noBookmark}>
          {/* {elevation !== null ? elevation.toFixed(2) : 'Loading...'} */}
          Settings to be implemented ...
        </div>
      </div>
    </Menu>
  );
};

export default Bookmarks;
