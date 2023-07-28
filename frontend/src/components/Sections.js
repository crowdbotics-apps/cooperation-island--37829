import { useDrop } from "react-dnd";
import { rankedQualities } from "../libs/utils";
import Qualities from "./Qualities";
import { Howl } from "howler";

const Sections = ({ addItems, className, clsQuality, clsSection, data, moveItems, style, SectionImg, ...rest }) => {
    const [{ canDrop, isDropping }, sessionRef] = useDrop({
        accept: ["quality", "section"],
        canDrop: ({ id }) => !data.includes(id),
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
            isDropping: monitor.isOver()
        }),
        drop: ({ id }) => {
            new Howl({
                src: require("../assets/sounds/Put_Down.mp3"),
                autoplay: true
            });

            addItems(id);
        }
    });

    return <div
        className={className}
        ref={sessionRef}
        style={{
            ...style,
            filter: `brightness(${canDrop ? 0.5 : 1})`,
            transform: `scale(${(canDrop && isDropping) ? 1.1 : 1})`,
            background: `url(${SectionImg})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "15vw 55vh"
        }}>
        <div className={clsSection}>
            {data
                .map((x, i, list) => {
                    return <Qualities
                        className={clsQuality}
                        data={data}
                        key={i}
                        index={i}
                        first={i === 0}
                        last={i === list.length - 1}
                        moveItems={moveItems}
                        sm
                        {...rankedQualities[x - 1]}
                        {...rest}
                    />
                })}
        </div>
    </div>
}

export default Sections;