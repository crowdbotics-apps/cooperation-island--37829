import { useEffect } from "react";
import { isMobile } from "mobile-device-detect";

const aspectRatio = parseFloat(window.innerWidth / window.innerHeight).toFixed(2) > 2.15;

const IFrame = () => {
    useEffect(() => {
        window.addEventListener("resize", () => {
            if (!isMobile)
                window.location.reload();
        });
    }, []);

    return <div
        style={{
            alignItems: "center",
            background: "black",
            display: "flex",
            justifyContent: "center",
            height: "100vh",
            width: "100vw"
        }}>
        <iframe
            style={{
                height: aspectRatio ? window.innerHeight : window.innerWidth / 2.15,
                width: aspectRatio ? window.innerHeight * 2.15 : window.innerWidth
            }}
            src={"/app" + location.pathname}
        />
    </div>
}

export default IFrame;