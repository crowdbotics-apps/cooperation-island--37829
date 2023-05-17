import anime from "animejs";

export const showLoginBoard = () => {
    anime({
        targets: "#logo",
        top: "-12%",
        left: "-12%",
        scale: 0.45,
        translateX: "0%",
        translateY: "0%",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime({
        targets: "#guide",
        left: "7%",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime({
        targets: "#board",
        left: "63%",
        easing: "easeOutQuint",
        duration: 2000
    });
}

export const showResetPassword = () => {
    anime({
        targets: "#logo",
        top: "-12%",
        left: "-12%",
        scale: 0.45,
        translateX: ["-50%", "0%"],
        translateY: ["-50%", "0%"],
        easing: "easeOutQuint",
        duration: 2000
    });
    anime({
        targets: "#guide",
        left: "7%",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime({
        targets: "#board2",
        left: "50%",
        easing: "easeOutQuint",
        duration: 2000
    });
}

export const showReadingPane = () => {
    anime({
        targets: "#logo",
        top: "-12%",
        left: "-12%",
        scale: 0.45,
        translateX: "0%",
        translateY: "0%",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime({
        targets: "#guide",
        left: "7%",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime({
        targets: "#board3",
        left: "42%",
        easing: "easeOutQuint",
        duration: 2000
    });
}

export const showLandingPage = () => {
    anime({
        targets: "#logo",
        opacity: 0.6,
        easing: "easeInQuint",
        duration: 2000
    });
}