import logo from "./logo.svg";
import "./App.css";
import { ImageCropper } from "./components/ImageCropper";
import { Homepage } from "./pages/Homepage";
import { LoginModal } from "./components/LoginModal";
import { useCookies } from "react-cookie";
import { Button, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { paimonTheme } from "./styles/Themes";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#df988d",
        },
        secondary: {
            main: "#d9c5c5",
        },
    },
});

function App() {
    const [cookies, setCookies, removeCookies] = useCookies(["user"]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="App">
                <h1>{cookies.user}</h1>
                <Button
                    onClick={() => {
                        removeCookies("user");
                    }}
                >
                    Clear Cookies
                </Button>
                <LoginModal />
            </div>
        </ThemeProvider>
    );
}

export default App;
