const MM_TO_PIX = 3.7795275591

export default function ElementCircle(props) {

    const width = props._width * MM_TO_PIX
    const height = props._height * MM_TO_PIX

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx={width / 2}
                cy={height / 2}
                r={width / 2}
                fill={props._fill}
                stroke={props._stroke}
            />
        </svg>
    )
}
