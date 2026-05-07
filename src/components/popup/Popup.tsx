import styles from './popup.module.css';

// COMPONENTS
import Icon from '../icon/Icon';

type PopupProps = {
    show: boolean,
    onClose: () => void,
    children?: React.ReactNode,
    color?: string,
    style?: React.CSSProperties,
}

export default function Popup({ show, onClose, children, color, style }: PopupProps) {
    if(!show) return null;

    return (
        <div className={styles.background}>
            <div
                className={styles.container}
                style={style}
            >
                <Icon
                    name="x"
                    size="1.5rem"
                    color={color ? color : "var(--blue)"}
                    onClick={onClose}
                    className={styles.closeIcon}
                />
                
                { children }
            </div>
        </div>
    )
}
