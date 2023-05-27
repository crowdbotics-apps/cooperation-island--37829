import ReactDOM from "react-dom";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { ThemeProvider } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";
import DateFnsUtils from "@date-io/date-fns";
import CITheme from "./styles/CITheme";
import App from "./App";
import "./styles/index.scss";

ReactDOM.render(
    <BrowserRouter>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <ThemeProvider theme={CITheme}>
                <App />
            </ThemeProvider>
        </MuiPickersUtilsProvider>
    </BrowserRouter>,
    document.getElementById("root")
);
