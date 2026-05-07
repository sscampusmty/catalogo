import IconsData from '../components/icon/icons.json';

type IconKeys = keyof typeof IconsData;

export type PathType = {
    d: string;
    fill?: boolean;
    stroke?: string;
    strokeWidth?: number;
    strokeLinecap?: "round" | "butt" | "square" | "inherit" | undefined;
    strokeLinejoin?: "round" | "inherit" | "miter" | "bevel" | undefined;
    cx?: string;
    cy?: string;
    r?: string;
    color?: string,
    x?: string,
    y?: string,
    width?: string,
    height?: string,
    content?: PathType[]
}

export type IconData = {
    [key in IconKeys]: {
        fill: string,
        paths: PathType[],
        viewBox: string,
    };
};

export type IconProps = {
    size: number | string | { width: number | string, height: number | string };
    color: string;
    name: IconKeys;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}
