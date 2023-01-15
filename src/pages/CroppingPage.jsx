import { Box, Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { ImageCropper } from "../components/ImageCropper";
import { useCookies } from "react-cookie";
import { Navbar } from "../components/Navbar";

export function CroppingPage(props) {
    const params = useParams();
    const [cookies, setCookies, removeCookies] = useCookies(["user"]);

    return (
        <Box component={"div"}>
            <Navbar />
            <Box component={"div"} sx={{ padding: "1rem" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant={"h1"}>Paimon cropping</Typography>
                        <Typography variant={"subtitle1"}>
                            Select the area that contains Paimon, then click
                            "Crop". If Paimon is not in the image, click "Skip".
                        </Typography>
                    </Grid>
                    <Grid item xs={0} md={3}></Grid>
                    <Grid item xs={12} md={6}>
                        <Box component={"div"}>
                            <ImageCropper
                                videoId={params.videoId}
                                contributorId={cookies.user}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={0} md={3}></Grid>
                </Grid>
            </Box>
        </Box>
    );
}
