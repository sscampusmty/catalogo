import styles from './navbar.module.css';

import Image from "next/image"

export default function Navbar({icon, children}: {icon?: boolean, children?: React.ReactNode}) {
    return (
        <div className={styles.container}>
            <Image
                src={`/images/${icon ? "icon" : "logo"}.png`}
                alt="logo"
                width={124}
                height={51}
                className={`${styles.logo} ${icon ? styles.icon : ""}`}
                onClick={() => {}}
            />

            <div className={styles.rightElements}>
                {children}
            </div>
        </div>
    )
}
