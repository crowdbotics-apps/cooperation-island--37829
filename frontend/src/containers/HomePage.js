import { Fragment, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { showLandingPage, showLoginBoard, showReadingPane, showResetPassword } from "../libs/animations";
import { AppContext } from "../App";
import anime from "animejs";
import LoadAssets from "../components/LoadAssets";

const useStyles = makeStyles((theme) => ({
    BG: {
        opacity: 0,
        height: "100vh",
        width: "100vw"
    },
    logo: {
        position: "absolute",
        top: "-80%",
        left: "50%",
        height: "60vh",
        width: "60vw",
        transform: "translateX(-50%) translateY(-50%)"
    },
    root: {
        background: theme.palette.primary.BG
    },
    hidden: {
        display: "none"
    }
}));

const HomePage = () => {
    const cls = useStyles();

    const history = useHistory();

    const { user } = useContext(AppContext);

    const [loadedItems, setLoaded] = useState(0);

    const allItems = document.querySelectorAll("#assets").length;

    const isLoaded = loadedItems === allItems;

    useEffect(() => {
        if (isLoaded) {
            anime
            .timeline({
                delay: 200
            })
                .add({
                    targets: "#background",
                    opacity: 1,
                    easing: "linear",
                    duration: 2000
                })
                .add({
                    targets: "#logo",
                    top: "58%",
                    easing: "easeOutElastic",
                    duration: 2000
                }, "-=2000")
                .finished.then(() => {
                    anime({
                        targets: "#background",
                        opacity: 0.2,
                        easing: "linear",
                        duration: 2000
                    });
                    if (!user.active) {
                        if (window.location.pathname === "/")
                        history.push("/login");

                        showLoginBoard();
                        showResetPassword();
                        showReadingPane();
                    }
                    else {
                        if (window.location.pathname === "/reset-password")
                        showResetPassword();
                        else if (window.location.pathname === "/access")
                        showLandingPage();
                        else if (window.location.pathname === "/") {
                            if (!user.access) {
                                history.push("/access");
                                showLandingPage();
                            }
                            else {
                                anime({
                                    targets: "#logo",
                                    top: "150%",
                                    easing: "easeInElastic",
                                    duration: 2000
                                });
                            }
                        }
                    }
                });
        }
    }, [loadedItems]);

    const handleLoaded = () => {
        setLoaded(x => x + 1);
    }

    return <Fragment>
        <div className={cls.root}>
            <img className={cls.BG} id="background" src={require("../assets/images/Application_BG.jpg")} />
            <img className={cls.logo} id="logo" src={require("../assets/images/Logo_Text.png")} />
        </div>
        {!isLoaded && <LoadAssets onLoad={handleLoaded} progress={Math.round((loadedItems / allItems) * 100)} />}
    </Fragment>
}

export default HomePage;