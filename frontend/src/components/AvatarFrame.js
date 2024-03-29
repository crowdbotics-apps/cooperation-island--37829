import { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { anime } from "../libs/utils";
import FrameImg from "../assets/images/Frame.png";
import FrameAltImg from "../assets/images/Frame-alt.png";
import clsx from "clsx";

const useStyles = makeStyles({
    avatar: {
        height: "41.66vh",
        width: "14vw"
    },
    avatar_1: {
        transform: "scaleX(-1)",
        marginTop: "3vh",
        marginLeft: "0.4vw"
    },
    avatar_2: {
        transform: "scaleX(-1)",
        marginTop: "4vh",
        marginLeft: "0.4vw"
    },
    avatar_3: {
        transform: "scaleX(-1)",
        marginTop: "5vh",
        marginLeft: "0.4vw"
    },
    avatar_4: {
        transform: "scaleX(-1)",
        marginTop: "4vh",
        marginLeft: "0.6vw"
    },
    avatar_5: {
        transform: "scaleX(-1)",
        marginTop: "4vh",
        marginLeft: "0.2vw"
    },
    avatar_6: {
        marginTop: "2vh",
        marginLeft: "1vw"
    },
    avatar_7: {
        marginTop: "4vh",
        marginLeft: "0.1vw"
    },
    avatar_8: {
        marginTop: "3vh",
        marginLeft: "-0.4vw"
    },
    avatar_9: {
        marginTop: "5vh",
        marginLeft: "0.1vw"
    },
    avatar_10: {
        marginTop: "5vh",
        marginLeft: "0.1vw"
    },
    container: {
        position: "absolute",
        overflow: "hidden",
        height: "24.3vh",
        width: "14vw",
        top: "0vh"
    },
    frame: {
        height: "27.1vh",
        width: "16vw"
    },
    root: {
        position: "relative",
        transform: "scale(0)"
    },
    worm: {
        position: "absolute",
        height: "4.37vh",
        width: "4vw"
    },
    variant1: {
        top: "-0.5vh",
        left: "-0.5vw",
        rotate: "-45deg"
    },
    variant2: {
        top: "-2.2vh",
        left: "5.6vw"
    },
    variant3: {
        top: "-0.6vh",
        left: "11vw",
        rotate: "20deg"
    }
});

const AvatarFrame = (props) => {
    const cls = useStyles();

    const avatarId = "avatar" + props.avatar;

    useEffect(() => {
        if (props.active)
            anime({
                targets: `#frame[prefix="${avatarId}"]`,
                scale: [0.9, 1],
                duration: 250
            });
    }, [props.active]);

    return <div className={clsx(cls.root, props.className)} id="frame" prefix={avatarId} onClick={props.onClick}>
        <img className={clsx(cls.frame, "pointer")} src={props.active ? FrameAltImg : FrameImg} />
        <svg className={clsx(cls.worm, cls[`variant${props.variant}`], "pointer")} viewBox="0 0 74 38">
            <path d="M18.7489 17.2301C24.2182 20.2115 32.8592 -0.339056 46.481 0.00425575C60.0907 0.353591 61.9962 14.0379 63.0333 20.5488C64.0705 27.0536 72.8984 24.1264 73.3024 30.8963C73.6944 37.6662 66.3498 40.762 57.5098 34.2331C48.5372 27.6198 53.729 17.0916 46.2217 15.0317C37.8942 12.7429 35.03 32.2334 17.3017 29.8363C2.61262 27.8427 11.5009 13.279 18.7489 17.2301Z" fill="#B1B233" />
            <path d="M28.1773 11.0625C25.1562 15.2244 27.3813 22.0846 32.7842 17.1818C38.1991 12.2731 42.3116 7.82207 48.0582 9.89398C53.7988 11.9719 58.3876 6.83429 54.0641 2.88921C49.7466 -1.04984 37.4273 -1.67021 28.1773 11.0625Z" fill="#B1B233" />
            <path d="M3.90315 13.2669C10.4035 5.79833 24.5439 9.21338 24.1399 22.2351C23.6816 37.1602 -9.29655 28.4087 3.90315 13.2669Z" fill="#B1B233" />
            <path d="M5.61059 13.3813C8.99945 8.21353 21.2705 9.84577 19.8776 18.5912C18.2435 28.7882 -1.37217 24.0721 5.61059 13.3813Z" fill="#C9CF3B" />
            <path d="M24.5515 14.1102C27.2348 11.3697 34.5251 15.3088 30.3463 20.1151C26.1736 24.9155 20.1375 18.6274 24.5515 14.1102Z" fill="#C9CF3B" />
            <path d="M31.305 6.94277C34.6154 3.87706 40.8625 8.4425 37.8536 12.8514C34.8627 17.2602 26.8066 11.1167 31.305 6.94277Z" fill="#C9CF3B" />
            <path d="M41.1256 0.757012C46.7215 -1.74254 50.1103 5.53327 44.2793 7.98464C39.196 10.1228 36.2654 2.9253 41.1256 0.757012Z" fill="#C9CF3B" />
            <path d="M51.0121 2.45558C55.402 0.0644402 59.6712 6.40066 56.3668 9.50251C53.0563 12.5983 45.8444 5.27435 51.0121 2.45558Z" fill="#C9CF3B" />
            <path d="M57.5215 14.2306C62.056 12.8874 63.0088 18.4467 59.1134 19.9585C55.23 21.4702 53.5417 15.4171 57.5215 14.2306Z" fill="#C9CF3B" />
            <path d="M62.1255 26.4031C63.7958 23.0483 68.656 25.6261 67.2751 28.5112C65.8942 31.4022 60.3466 29.9808 62.1255 26.4031Z" fill="#C9CF3B" />
            <path d="M7.41228 16.0013C6.03744 15.64 4.0415 17.995 5.38017 19.3622C6.72486 20.7354 8.79918 16.3507 7.41228 16.0013Z" fill="#543615" />
            <path d="M15.8453 17.7479C17.196 18.2358 17.4975 21.3015 15.6162 21.6629C13.7288 22.0363 14.5247 17.2601 15.8453 17.7479Z" fill="#543615" />
        </svg>
        <div className={clsx(cls.container, "pointer")}>
            <img className={clsx(cls.avatar, cls[`avatar_${props.avatar}`], "pointer")} src={require(`../assets/avatars/xs/Avatar_${props.avatar}.png`)} />
        </div>
    </div>

}

export default AvatarFrame;