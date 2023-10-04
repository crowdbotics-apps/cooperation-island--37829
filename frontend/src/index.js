import ReactDOM from "react-dom";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { isMobileOnly as isMobile } from "mobile-device-detect";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { ThemeProvider } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";
import { DndProvider } from "react-dnd";
import DateFnsUtils from "@date-io/date-fns";
import CITheme from "./styles/CITheme";
import IFrame from "./IFrame";
import App from "./App";
import "./styles/index.scss";

ReactDOM.render(
    window.location.href.includes("/app") ?
        <BrowserRouter basename="app">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
                    <ThemeProvider theme={CITheme}>
                        <App />
                    </ThemeProvider>
                </DndProvider>
            </MuiPickersUtilsProvider>
        </BrowserRouter>
        : <IFrame />,
    document.getElementById("root")
);
