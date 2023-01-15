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
import { useAuth } from "../auth";
import { useNavigate } from "react-router-dom";

export function Navbar() {
    const auth = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        auth.logout();
        navigate("/", { replace: true });
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
                    <IconButton href={"/contributions"}>
                        <Leaderboard sx={{ color: "primary.contrastText" }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title={"Logout"}>
                    <IconButton onClick={handleLogout}>
                        <Logout sx={{ color: "primary.contrastText" }} />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
}
