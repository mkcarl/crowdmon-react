import "./App.css";
import { LandingPage } from "./pages/LandingPage";
import { useCookies } from "react-cookie";
import {
    createTheme,
    CssBaseline,
    responsiveFontSizes,
    ThemeProvider,
} from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
import { CroppingPage } from "./pages/CroppingPage";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#df988d",
        },
        secondary: {
            main: "#d9c5c5",
        },
        background: {
            default: "#303030",
        },
    },
});

const responsiveTheme = responsiveFontSizes(theme);

function App() {
    return (
        <ThemeProvider theme={responsiveTheme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<LandingPage />}></Route>
                    <Route path={"/homepage"} element={<Homepage />}></Route>
                    <Route
                        path={"/crop/:videoId"}
                        element={<CroppingPage />}
                    ></Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
