const MM_TO_PIX = 3.7795275591

export default function ElementRectangle(props) {

    const width = props._width * MM_TO_PIX
    const height = props._height * MM_TO_PIX

    const style = {
        outline: props._stroke,
        backgroundColor: props._fill,
        width,
        height,
    }

    return (
        <div style={style}></div>
    )
}
