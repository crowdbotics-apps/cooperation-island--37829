import ReactDOM from "react-dom";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { HTML5Backend } from "react-dnd-html5-backend";
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
                <DndProvider backend={HTML5Backend}>
                    <ThemeProvider theme={CITheme}>
                        <App />
                    </ThemeProvider>
                </DndProvider>
            </MuiPickersUtilsProvider>
        </BrowserRouter>
        : <IFrame />,
    document.getElementById("root")
);
