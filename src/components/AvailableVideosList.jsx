import {
    Chip,
    CircularProgress,
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

export function AvailableVideosList() {
    const [videoTitles, setVideoTitles] = useState([]);

    useEffect(() => {
        const setVideoTitlesFromServer = async () => {
            const videos = (
                await axios.get("http://100.76.207.17:8000/videoTitles")
            ).data;
            setVideoTitles(videos);
        };
        setVideoTitlesFromServer().then();
    }, []);

    return (
        <Paper elevation={12}>
            <Typography variant={"h2"}>Available videos</Typography>
            <List>
                {videoTitles.map((video) => (
                    <VideoItem name={video} key={video} />
                ))}
            </List>
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
                    `http://100.76.207.17:8000/videoCropStatus?videoId=${props.name}`
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
                <div>
                    <Typography variant={"subtitle1"}>{props.name}</Typography>
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
                </div>
            </ListItemText>
        </ListItemButton>
    );
}
