import { useCookies } from "react-cookie";
import { LoginModal } from "../components/LoginModal";
import { Box, Grid, Typography } from "@mui/material";
import { AvailableVideosList } from "../components/AvailableVideosList";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../auth";

export function Homepage() {
    const [cookies, setCookies, removeCookies] = useCookies(["user"]);
    const auth = useAuth();
    return (
        <>
            <Navbar />
            <Box
                component={"div"}
                sx={{
                    padding: "1rem",
                }}
            >
                <LoginModal />
                {auth.user && (
                    <Box component={"div"}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant={"h1"}>
                                    Welcome back {auth.user}
                                </Typography>
                            </Grid>
                            <Grid item xs={0} md={2}></Grid>
                            <Grid item xs={12} md={8}>
                                <AvailableVideosList />
                            </Grid>
                            <Grid item xs={0} md={2}></Grid>
                        </Grid>
                    </Box>
                )}
            </Box>
        </>
    );
}
