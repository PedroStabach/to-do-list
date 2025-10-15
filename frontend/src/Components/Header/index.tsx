import { ReactNode } from 'react';
import styles from './index.module.css';
import { FiMenu, FiSearch } from 'react-icons/fi';
type HeaderProps = {
  children: ReactNode;
};

export function Header ({children} : HeaderProps ) {
    return (
        <>
            <div className={styles.Header}>
                <FiMenu size={30} className={styles.FiIcon}/>
                <h1>{children}</h1>
                <FiSearch size={30} className={styles.FiIcon}/>
            </div>
        </>
    );
}