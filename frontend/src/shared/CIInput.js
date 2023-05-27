import { makeStyles } from "@material-ui/core";
import InputImgmd from "../assets/images/Input-md.png";
import InputImgsm from "../assets/images/Input-sm.png";
import InputImgxs from "../assets/images/Input-xs.png";
import InputImgdisabled from "../assets/images/Input-disabled.png";
import clsx from "clsx";

const useStyles = (InputImg) => makeStyles((theme) => ({
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
        background: `url(${InputImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain"
    }
}));

const CIInput = (props) => {
    const type = props.disabled ? InputImgdisabled : props.xs ? InputImgxs : props.sm ? InputImgsm : InputImgmd;

    const cls = useStyles(type)();

    const params = { ...props };

    delete params.error;
    delete params.helperText;
    delete params.InputProps;
    delete params.sm;
    delete params.xs;

    return <input {...params} className={clsx(cls.root, props.className, props.disabled || "typer")} />
}

export default CIInput;