import { useEffect, useState } from "react";
import axios from "axios";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Skeleton,
    Typography,
} from "@mui/material";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: "px",
                width: mediaWidth,
            },
            1,
            50,
            50
        ),
        mediaWidth,
        mediaHeight
    );
}

async function sendCrop(crop, videoId, imageId, contributor) {
    await axios.post("http://100.76.207.17:8000/crop", {
        videoId: videoId,
        imageId: imageId,
        x: crop.x,
        y: crop.y,
        width: crop.width,
        height: crop.height,
        annotationClass: "paimon",
        contributorId: contributor,
        timestamp: Math.floor(new Date() / 1000),
    });
}

async function sendSkipCrop(videoId, imageId, contributor) {
    await axios.post("http://100.76.207.17:8000/crop", {
        videoId: videoId,
        imageId: imageId,
        annotationClass: "none",
        contributorId: contributor,
        timestamp: Math.floor(new Date() / 1000),
    });
}

export function ImageCropper(props) {
    const [image, setImage] = useState({});
    const [refresh, setRefresh] = useState(false);
    const [crop, setCrop] = useState(null);
    const [completedCrop, setCompletedCrop] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [videoProgress, setVideoProgress] = useState({});
    const [completion, setCompletion] = useState(0);

    useEffect(() => {
        const getVideoProgressFromServer = async () => {
            const progress = (
                await axios.get(
                    `http://100.76.207.17:8000/videoCropStatus?videoId=${props.videoId}`
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

    const temp = `http://100.76.207.17:8000/randomImage?videoId=${props.videoId}`;
    const loadImage = async () => {
        const res = await axios.get(temp);
        setImage(res.data);
        console.log(image);
    };

    // on load
    useEffect(() => {
        loadImage().then(() => console.log("image loaded"));
    }, []);

    useEffect(() => {
        if (refresh) {
            setImage({});
            loadImage().then(() => console.log("image refreshed"));
            setRefresh(false);
            setImageLoaded(false);
        }
    }, [refresh]);

    function onImageLoad(e) {
        const { width, height } = e.currentTarget;
        setImageLoaded(true);
        setCrop(centerAspectCrop(width, height, 1));
    }

    return (
        <>
            <Paper elevation={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {completion === 100 && (
                            <Paper
                                elevation={1}
                                sx={{ width: 640, height: 360 }}
                            >
                                <Typography variant={"h2"}>
                                    This video is completely annotated.
                                </Typography>
                            </Paper>
                        )}
                        <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                        >
                            <Box
                                component={"img"}
                                src={image.url}
                                onLoad={onImageLoad}
                                width={640}
                                height={360}
                                loading={"lazy"}
                            />
                        </ReactCrop>
                    </Grid>
                    <Grid item xs={12}>
                        <Container>
                            {!image.name && (
                                <Skeleton variant={"caption"} width={"20rem"} />
                            )}
                            <Typography variant={"caption"}>
                                {image.name}
                            </Typography>
                        </Container>
                    </Grid>
                    <Grid item xs={12}>
                        <Container>
                            <Button
                                onClick={() => {
                                    sendCrop(
                                        completedCrop,
                                        props.videoId,
                                        image.name,
                                        props.contributorId
                                    ).then(
                                        () => setRefresh(true),
                                        () => console.log("send crop failed")
                                    );
                                    setRefresh(true);
                                }}
                                color={"primary"}
                                variant={"contained"}
                                disabled={completion >= 100 && !imageLoaded}
                            >
                                Crop
                            </Button>
                            <Button
                                onClick={() => {
                                    sendSkipCrop(
                                        props.videoId,
                                        image.name,
                                        props.contributorId
                                    ).then(
                                        () => setRefresh(true),
                                        () => console.log("send crop failed")
                                    );
                                    setRefresh(true);
                                }}
                                color={"secondary"}
                                variant={"contained"}
                                disabled={completion >= 100 && !imageLoaded}
                            >
                                skip
                            </Button>
                        </Container>
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
}
