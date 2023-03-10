import {
    Box,
    Chip,
    CircularProgress,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import { VideoLibrary } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import { alignProperty } from "@mui/material/styles/cssUtils";

export function AvailableVideosList() {
    const [videoTitles, setVideoTitles] = useState([]);
    const [availableVideosLoading, setAvailableVideosLoading] = useState(true);

    useEffect(() => {
        const setVideoTitlesFromServer = async () => {
            const videos = (
                await axios.get(
                    `${process.env.REACT_APP_API_ROUTE}/videoTitles`
                )
            ).data;
            setAvailableVideosLoading(false);
            setVideoTitles(videos);
        };
        setVideoTitlesFromServer().then();
    }, []);

    return (
        <Paper elevation={12}>
            <Box component={"div"} sx={{ padding: "1rem" }}>
                <Typography variant={"h2"} textAlign={"center"}>
                    Available videos
                </Typography>
                <Divider />
                {availableVideosLoading && (
                    <Box
                        component={"div"}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "1rem",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}
                <List>
                    {videoTitles.map((video) => (
                        <VideoItem name={video} key={video} />
                    ))}
                </List>
            </Box>
        </Paper>
    );
}

function VideoItem(props) {
    const [videoProgress, setVideoProgress] = useState({});
    const [completion, setCompletion] = useState(0);

    useEffect(() => {
        const getVideoProgressFromServer = async () => {
            const progress = (
                await axios.get(
                    `${process.env.REACT_APP_API_ROUTE}/videoCropStatus?videoId=${props.name}`
                )
            ).data;
            setVideoProgress(progress);
        };
        getVideoProgressFromServer().then();
    }, []);

    useEffect(() => {
        if (videoProgress.cropped === 0) {
            setCompletion(0);
        } else {
            setCompletion((videoProgress.cropped / videoProgress.total) * 100);
        }
    }, [videoProgress]);

    return (
        <ListItemButton href={`/crop/${props.name}`}>
            <ListItemIcon>
                <VideoLibrary color={"primary"} />
            </ListItemIcon>
            <ListItemText>
                <Box component={"div"} sx={{ display: "flex" }}>
                    <Typography variant={"subtitle1"} flexGrow={1}>
                        {props.name}
                    </Typography>
                    <Chip
                        label={
                            !isNaN(completion)
                                ? `${completion.toFixed(2)}%`
                                : "..."
                        }
                        color={
                            completion < 20
                                ? "error"
                                : completion < 90
                                ? "warning"
                                : "success"
                        }
                    />
                </Box>
            </ListItemText>
        </ListItemButton>
    );
}
