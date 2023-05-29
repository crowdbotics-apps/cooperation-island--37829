import { makeStyles } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.primary.main,
        display: "block",
        fontFamily: "Summer Show",
        fontSize: "3.3vh",
        fontWeight: "400",
        height: "3.3vh"
    }
}))

const CILabel = (props) => {
    const cls = useStyles();

    return <label {...props} className={clsx(cls.root, props.className, "typer")} />
}

export default CILabel;