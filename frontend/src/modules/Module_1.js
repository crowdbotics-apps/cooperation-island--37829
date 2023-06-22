import { useEffect } from "react";
import anime from "animejs";
import $ from "jquery";

const Module_1 = () => {
    useEffect(() => {
        anime
            .timeline()
            .add({
                targets: "#background",
                opacity: 0,
                easing: "linear",
                duration: 2000,
                complete: () => {
                    $("#background").attr("src", require("../assets/modules/Module_1_BG.jpg"));
                }
            })
            .add({
                targets: "#background",
                opacity: 1,
                easing: "linear",
                duration: 2000
            });
    }, []);

    return <div>

    </div>
}

export default Module_1;