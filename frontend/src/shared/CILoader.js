import { Backdrop, makeStyles } from "@material-ui/core";
import LoadingSpinner from "../components/LoadingSpinner";

const useStyles = makeStyles({
    backdrop: {
        zIndex: 10
    }
});

const CILoader = (props) => {
    const cls = useStyles();

    return <Backdrop className={cls.backdrop} open={props.open}>
        <LoadingSpinner />
    </Backdrop>
}

export default CILoader;