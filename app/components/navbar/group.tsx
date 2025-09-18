import React from 'react';
import styles from './group.module.css';

interface Props {
  children: React.ReactNode;
}

const Group: React.FC<Props> = ({ children }) => {
  return <div className={styles.group}>{children}</div>;
};

export default Group;
