import { useContext, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core";
import { useDrag, useDrop } from "react-dnd";
import CILabel from "../shared/CILabel";
import { AppContext } from "../App";
import { Howl } from "howler";
import anime from "animejs";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    index: {
        "& label": {
            color: "#3F8477",
            paddingTop: "0.1vh"
        },
        position: "absolute",
        textAlign: "center",
        background: theme.palette.primary.contrast,
        borderRadius: "10vw",
        margin: "1.6vh 0.75vw",
        height: "2vw",
        width: "2vw"
    },
    center: {
        textAlign: "center",
        paddingLeft: "1vw"
    },
    notCenter: {
        marginLeft: "3.5vw"
    },
    quality: {
        color: theme.palette.primary.contrast,
        paddingTop: "1.75vh",
        paddingRight: "1vw",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    }
}));

const Qualities = ({ className, data, desc, disabled, draggingId, first, id, index, last, moveItems, setDragging, sm, text }) => {
    const cls = useStyles();

    const qualityId = "quality" + id;

    const { showTooltip } = useContext(AppContext);

    const qualityRef = useRef();

    const [{ isDragging }, drag] = useDrag({
        type: sm ? "quality" : "section",
        item: { id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: (_, monitor) => {
            const item = monitor.getDropResult();

            if (monitor.didDrop())
                anime({
                    targets: "#" + (item.qualityId || qualityId),
                    scale: [0.6, 0.75],
                    duration: 1000
                });
        },
        options: {
            dropEffect: "move"
        }
    })

    const [, drop] = useDrop({
        accept: "quality",
        canDrop: ({ id }) => sm && data.includes(id),
        drop: () => ({ qualityId }),
        hover: (item, monitor) => {
            if (item.index !== index && monitor.canDrop() && qualityRef.current) {
                const hoverBoundingRect = qualityRef.current.getBoundingClientRect();
                const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
                const clientOffset = monitor.getClientOffset();
                const hoverClientY = clientOffset.y - hoverBoundingRect.top;

                if (item.index < index && hoverClientY < hoverMiddleY)
                    return;
                if (item.index > index && hoverClientY > hoverMiddleY)
                    return;

                moveItems(item.index, index);
                item.index = index;
            }
        }
    })

    drag(drop(qualityRef));

    useEffect(() => {
        if (isDragging) {
            showTooltip(false);
            sm && setDragging(id);

            new Howl({
                src: require("../assets/sounds/Pick_Up.mp3"),
                autoplay: true
            });
        }
        else {
            showTooltip(true);
            sm && setDragging(0);
        }
    }, [isDragging]);

    const handleSelection = () => {
        window.getSelection().removeAllRanges();
    }

    return <div
        className={clsx(className, "pointer")}
        data-tooltip-id="tooltip"
        data-tooltip-content={desc}
        id={qualityId}
        ref={disabled ? () => { } : qualityRef}
        unselectable
        style={{
            marginTop: sm ? "0vh" : first ? "1vh" : "3vh",
            marginBottom: (!sm && last) ? "1vh" : "0vh",
            marginLeft: sm ? "0.6vw" : "1vw",
            transform: `scale(${sm ? 0.75 : 1})`,
            opacity: draggingId === id ? 0 : 1
        }}>
        {sm && <div className={cls.index}>
            <CILabel onMouseDown={handleSelection}>
                {index + 1}
            </CILabel>
        </div>}
        <CILabel className={clsx(cls.quality, sm ? cls.notCenter : cls.center, "pointer")} onMouseDown={handleSelection}>
            {text}
        </CILabel>
    </div>
}

export default Qualities;