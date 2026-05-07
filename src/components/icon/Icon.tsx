import IconsData from './icons.json';

// TYPES
import { IconData, IconProps } from '../../types/Icons';

// @ts-ignore
const Icons: IconData = IconsData;

export default function Icon({ size, color, name, className, style, onClick }: IconProps) {
    const Icon = Icons[name];

    return(
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={typeof size === 'object' ? size.width : size}
            height={typeof size === 'object' ? size.height : size}
            viewBox={Icon.viewBox}
            className={className}
            onClick={onClick && onClick}
            style={style && style}
        >
            {
                Icon.paths.map((path, index) => (
                    <path
                        key={index}
                        d={path.d}
                        fill={path.fill ? color : 'none'}
                        stroke={color ? color : path.stroke}
                        strokeWidth={path.strokeWidth}
                        strokeLinecap={path.strokeLinecap}
                        strokeLinejoin={path.strokeLinejoin}
                        cx={path.cx}
                        cy={path.cy}
                        r={path.r}
                        color={path.color}
                        x={path.x}
                        y={path.y}
                        width={path.width}
                        height={path.height}
                    >
                        {
                            path.content && path.content.map((subPath, index) => (
                                <path
                                    key={index}
                                    d={subPath.d}
                                    fill={subPath.fill ? color : 'none'}
                                    stroke={subPath.stroke}
                                    strokeWidth={subPath.strokeWidth}
                                    strokeLinecap={subPath.strokeLinecap}
                                    strokeLinejoin={subPath.strokeLinejoin}
                                    cx={subPath.cx}
                                    cy={subPath.cy}
                                    r={subPath.r}
                                    color={subPath.color}
                                    x={subPath.x}
                                    y={subPath.y}
                                    width={subPath.width}
                                    height={subPath.height}
                                />
                            ))
                        }
                    </path>
                ))
            }
        </svg>
    )
};
