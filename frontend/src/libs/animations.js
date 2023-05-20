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
    anime
        .timeline()
        .add({
            targets: "#board4",
            top: ["76%", "10%"],
            easing: "easeOutQuint",
            duration: 2000
        })
        .add({
            targets: "#guide",
            top: "-0.5%",
            scale: [0, 1],
            easing: "easeOutQuint",
            duration: 2000
        })
        .add({
            targets: "#animal",
            top: "0.3%",
            scale: [0, 1],
            easing: "easeOutQuint",
            duration: 2000
        });
}

export const showHomePage = () => { }

export const showLogo = () => {
    anime({
        targets: "svg",
        strokeDashoffset: [0, 500],
        easing: "linear",
        duration: 2000,
        direction: "alternate",
        loop: true
    });
    anime({
        targets: "g",
        stroke: ["#CEB891", "#7C382D"],
        easing: "linear",
        duration: 2000,
        direction: "alternate",
        loop: true
    });
}