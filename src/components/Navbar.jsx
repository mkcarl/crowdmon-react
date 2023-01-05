import {
    AppBar,
    IconButton,
    Link,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import { Home, Leaderboard, Logout } from "@mui/icons-material";
import { useCookies } from "react-cookie";

export function Navbar() {
    const [cookies, setCookies, removeCookies] = useCookies(["user"]);
    const logout = () => {
        removeCookies("user");
    };

    return (
        <AppBar position="static" color={"primary"} enableColorOnDark={true}>
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, userSelect: "none" }}
                >
                    <Link
                        href={"/"}
                        underline={"none"}
                        color={"primary.contrastText"}
                    >
                        Crowdmon
                    </Link>
                </Typography>
                <Tooltip title={"Home"}>
                    <IconButton href={"/homepage"}>
                        <Home sx={{ color: "primary.contrastText" }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title={"Contribution"}>
                    <IconButton>
                        <Leaderboard sx={{ color: "primary.contrastText" }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title={"Logout"}>
                    <IconButton onClick={logout}>
                        <Logout sx={{ color: "primary.contrastText" }} />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
}
