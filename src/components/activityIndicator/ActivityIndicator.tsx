import styles from './activityIndicator.module.css';

export default function ActivityIndicator({ color, size, className }: { color?: string, size?: string | number, className?: string }) {
    const mainStyle = styles["pure-material-progress-circular"];
    
    return (
        <progress
            style={{
                color: color && color,
                width: size && size,
                height: size && size
            }}
            className={`${mainStyle} ${className}`}
        />
    )
}
