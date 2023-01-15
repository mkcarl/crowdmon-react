import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { useAuth } from "../auth";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function LoginPage() {
    const [username, setUsername] = useState("");
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = location.state?.path || "/";

    const handleLogin = () => {
        auth.login(username);
        navigate("/homepage", { replace: true }); // navigate to homepage (can change to redirect)
    };

    return (
        <Box>
            <Grid container>
                <Grid item xs={0} md={4}></Grid>
                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                        height: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <Paper
                        elevation={1}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "30%",
                        }}
                    >
                        <Box
                            component={"div"}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                            }}
                        >
                            <Typography variant={"h4"} textAlign={"center"}>
                                Login
                            </Typography>
                            <TextField
                                name={"username"}
                                label={"Plese insert your username"}
                                variant={"filled"}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <Button
                                disabled={!username}
                                color={"primary"}
                                variant={"contained"}
                                onClick={handleLogin}
                                autoFocus={true}
                                sx={{ alignSelf: "center" }}
                            >
                                Continue
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={0} md={4}></Grid>
            </Grid>
        </Box>
    );
}
