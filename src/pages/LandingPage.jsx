import { Box, Button, Grid, Typography } from "@mui/material";
import paimonRead from "../static/paimon_read.png";

export function LandingPage() {
    return (
        <Grid container spacing={0}>
            <Grid item xs={12} sm={12} md={6}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100vh",
                        padding: "10vw",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        userSelect: "none",
                    }}
                    bgcolor={"primary.dark"}
                >
                    <Typography variant={"h1"}>Crowdmon</Typography>
                    <Typography variant={"h2"}>
                        crowd-sourcing for Paimon dataset
                    </Typography>
                    <Button
                        href={"/homepage"}
                        variant={"contained"}
                        color={"secondary"}
                    >
                        Get started
                    </Button>
                </Box>
            </Grid>
            <Grid
                item
                xs={0}
                sm={0}
                md={6}
                sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
            >
                <Box
                    component={"div"}
                    alignSelf={"flex-end"}
                    maxHeight={"100%"}
                    userSelect={"none"}
                    draggable={"false"}
                >
                    <Box
                        component={"img"}
                        src={paimonRead}
                        sx={{
                            width: "auto",
                            maxWidth: "100%",
                            height: "100%",
                            maxHeight: "100vh",
                            transform: "translateX(-20%)",
                            display: "block",
                        }}
                    />
                </Box>
            </Grid>
        </Grid>
    );
}
