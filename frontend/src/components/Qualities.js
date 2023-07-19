import { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import CILabel from "../shared/CILabel";
import { Howl } from "howler";
import anime from "animejs";
import clsx from "clsx";

const Qualities = ({ className, desc, first, id, last, sm, text }) => {
    const qualityId = "quality" + id;

    const qualityRef = useRef();

    const [{ isDragging }, drag] = useDrag({
        type: "sections",
        item: { id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: (_, monitor) => {
            if (monitor.didDrop())
                anime({
                    targets: "#" + qualityId,
                    scale: [0.6, 0.75],
                    duration: 1000
                });
        },
        options: {
            dropEffect: "move"
        }
    })

    drag(qualityRef);

    useEffect(() => {
        if (isDragging)
            new Howl({
                src: require("../assets/sounds/Pick_Up.mp3"),
                autoplay: true
            });
    }, [isDragging]);

    return <div
        className={clsx(className, sm ? "" : "pointer")}
        data-tooltip-id="tooltip"
        data-tooltip-content={desc}
        id={qualityId}
        ref={sm ? () => { } : qualityRef}
        style={{
            marginTop: sm ? "0vh" : first ? "1vh" : "3vh",
            marginBottom: (!sm && last) ? "1vh" : "0vh",
            marginLeft: sm ? "0.6vw" : "1vw",
            transform: `scale(${sm ? 0.75 : 1})`
        }}>
        <CILabel className={sm ? "" : "pointer"}>
            {text}
        </CILabel>
    </div>
}

export default Qualities;