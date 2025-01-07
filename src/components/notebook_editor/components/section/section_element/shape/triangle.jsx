const MM_TO_PIX = 3.7795275591;

export default function ElementTriangle(props) {
    const widthInPixels = props._width * MM_TO_PIX;
    const heightInPixels = props._height * MM_TO_PIX;

    return (
        <svg
            width={widthInPixels}
            height={heightInPixels}
            viewBox={`0 0 ${widthInPixels} ${heightInPixels}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <polygon
                points={`0,${heightInPixels} ${widthInPixels},${heightInPixels} ${widthInPixels / 2},0`}
                fill={props._fill}
                stroke={props._stroke}
            />
        </svg>
    );
}
