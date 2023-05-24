import { makeStyles } from "@material-ui/core";
import AvatarFrame from "../components/AvatarFrame";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    frame: {
        "&:last-child": {
            marginBottom: "10vh"
        },
        marginTop: "10vh"
    },
    list: {
        position: "absolute",
        paddingLeft: "8vw",
        width: "24vw"
    },
    right: {
        left: "68vw"
    },
    root: {
        "&::-webkit-scrollbar": {
            display: "block",
            width: "0.5vw"
        },
        "&::-webkit-scrollbar-thumb": {
            background: theme.palette.primary.main,
            borderRadius: "1vw"
        },
        "&::-webkit-scrollbar-track": {
            background: "transparent"
        },
        position: "absolute",
        height: "141vh",
        width: "100vw",
        top: "0vh",
        overflowX: "hidden"
    }
}));

const Avatar = () => {
    const cls = useStyles();

    return <div className={cls.root} id="avatar-page">
        <div className={cls.list}>
            <AvatarFrame className={cls.frame} variant={1} />
            <AvatarFrame className={cls.frame} variant={2} />
            <AvatarFrame className={cls.frame} variant={3} />
            <AvatarFrame className={cls.frame} variant={1} />
            <AvatarFrame className={cls.frame} variant={2} />
        </div>
        <div className={clsx(cls.list, cls.right)}>
            <AvatarFrame className={cls.frame} variant={3} />
            <AvatarFrame className={cls.frame} variant={1} />
            <AvatarFrame className={cls.frame} variant={2} />
            <AvatarFrame className={cls.frame} variant={3} />
            <AvatarFrame className={cls.frame} variant={1} />
        </div>
    </div>
}

export default Avatar;