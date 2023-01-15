import "./App.css";
import { LandingPage } from "./pages/LandingPage";
import {
    createTheme,
    CssBaseline,
    responsiveFontSizes,
    ThemeProvider,
} from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
import { CroppingPage } from "./pages/CroppingPage";
import { ContributionsPage } from "./pages/ContributionsPage";
import { PersonalContributionPage } from "./pages/PersonalContributionPage";
import { AuthProvider } from "./auth";
import { LoginPage } from "./pages/LoginPage";
import { RequireAuth } from "./components/RequireAuth";

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
        <AuthProvider>
            <ThemeProvider theme={responsiveTheme}>
                <CssBaseline />

                <BrowserRouter>
                    <Routes>
                        <Route path={"/"} element={<LandingPage />}></Route>
                        <Route
                            path={"/homepage"}
                            element={
                                <RequireAuth>
                                    <Homepage />
                                </RequireAuth>
                            }
                        ></Route>
                        <Route
                            path={"/crop/:videoId"}
                            element={<CroppingPage />}
                        ></Route>
                        <Route
                            path={"/contributions"}
                            element={<ContributionsPage />}
                        ></Route>
                        <Route
                            path={"/contributions/:userId"}
                            element={
                                <RequireAuth>
                                    <PersonalContributionPage />
                                </RequireAuth>
                            }
                        ></Route>
                        <Route path={"/login"} element={<LoginPage />}></Route>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
