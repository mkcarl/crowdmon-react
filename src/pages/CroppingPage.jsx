import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { ImageCropper } from "../components/ImageCropper";
import { useCookies } from "react-cookie";
import { Navbar } from "../components/Navbar";

export function CroppingPage(props) {
    const params = useParams();
    const [cookies, setCookies, removeCookies] = useCookies(["user"]);

    return (
        <div>
            <Navbar />
            <Typography variant={"h1"}>{params.videoId}</Typography>
            <ImageCropper
                videoId={params.videoId}
                contributorId={cookies.user}
            />
        </div>
    );
}
