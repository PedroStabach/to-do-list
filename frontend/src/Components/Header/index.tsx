import { ReactNode } from 'react';
import styles from './index.module.css';
type HeaderProps = {
  children: ReactNode;
};

export function Header ({children} : HeaderProps ) {
    return (
        <>
            <div className={styles.Header}>
                {children}
                {children}
                {children}
            </div>
        </>
    );
}