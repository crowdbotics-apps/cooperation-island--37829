import anime from "animejs";
import $ from "jquery";

export const showLoginBoard = (alt) => {
    anime({
        targets: "#logo",
        top: "-12%",
        left: "-12%",
        scale: 0.45,
        translateX: alt ? ["-50%", "0%"] : "0%",
        translateY: alt ? ["-50%", "0%"] : "0%",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime({
        targets: "#guide",
        left: "6%",
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
        left: "3%",
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

export const showReadingPane = (alt) => {
    anime({
        targets: "#logo",
        top: "-12%",
        left: "-12%",
        scale: 0.45,
        translateX: alt ? ["-50%", "0%"] : "0%",
        translateY: alt ? ["-50%", "0%"] : "0%",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime({
        targets: "#guide",
        left: "2.5%",
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
            targets: "#logout",
            left: "94%",
            easing: "easeOutQuint",
            duration: 2000
        }, "-=2000")
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

export const showAvatarPage = () => {
    anime
        .timeline()
        .add({
            targets: "#background",
            opacity: 0,
            easing: "linear",
            duration: 2000,
            complete: () => {
                $("#background").attr("src", require("../assets/images/Avatar_BG.png"));
            }
        })
        .add({
            targets: "#background",
            opacity: 1,
            easing: "linear",
            duration: 2000
        })
        .add({
            targets: "#logout",
            left: "94%",
            easing: "easeOutQuint",
            duration: 2000,
            complete: () => {
                $("#logout").css("position", "sticky");
            }
        }, "-=2000")
        .add({
            targets: "#frame",
            scale: [0, 1],
            delay: (_, i) => i % 5 * 300,
            duration: 2000
        }, "-=2000")
        .add({
            targets: "#avatar-page",
            height: "100vh",
            easing: "linear",
            duration: 2000
        }, "-=4000");
}

export const showHomePage = () => { }

export const showLogo = () => {
    anime({
        targets: "#logo-text",
        strokeDashoffset: [0, 500],
        easing: "linear",
        duration: 2000,
        direction: "alternate",
        loop: true
    });
    anime({
        targets: "#logo-text g",
        stroke: ["#7C382D", "#CEB891"],
        easing: "linear",
        duration: 2000,
        direction: "alternate",
        loop: true
    });
}