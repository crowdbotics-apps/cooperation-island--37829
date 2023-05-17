import { makeStyles } from "@material-ui/core";
import clsx from "clsx";

const useStyles = (size) => makeStyles((theme) => ({
    root: {
        "&::placeholder": {
            color: theme.palette.primary.text
        },
        border: "none",
        color: theme.palette.primary.main,
        display: "block",
        fontFamily: "Summer Show",
        fontSize: "3.3vh",
        fontWeight: "400",
        outline: "none",
        padding: "0 1.6vw",
        height: "11.7vh",
        background: `url("/images/Input-${size}.png")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain"
    }
}));

const CIInput = (props) => {
    const size = props.disabled ? "disabled" : props.xs ? "xs" : props.sm ? "sm" : "md";
    const others = {
        xs: undefined,
        sm: undefined
    }
    const cls = useStyles(size)();

    return <input {...{ ...props, ...others }} className={clsx(cls.root, props.className)} />
}

export default CIInput;