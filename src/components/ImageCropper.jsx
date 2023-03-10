import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
    Alert,
    Box,
    Button,
    Divider,
    Grid,
    Paper,
    Skeleton,
    Typography,
} from "@mui/material";
import doneImage from "../static/done.jpg";

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

async function sendSkipCrop(videoId, imageId, contributor) {
    await axios.post(`${process.env.REACT_APP_API_ROUTE}/crop`, {
        videoId: videoId,
        imageId: imageId,
        annotationClass: "none",
        contributorId: contributor,
        timestamp: Math.floor(+new Date()),
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
    const [dimensions, setDimensions] = useState({ width: 640, height: 360 });
    const imgRef = useRef(null);

    useEffect(() => {
        const getVideoProgressFromServer = async () => {
            const progress = (
                await axios.get(
                    `${process.env.REACT_APP_API_ROUTE}/videoCropStatus?videoId=${props.videoId}`
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

    useEffect(() => {
        if (imageLoaded && Object.keys(image).length === 0) {
            setCompletion(100);
        }
    }, [image]);

    const temp = `${process.env.REACT_APP_API_ROUTE}/randomImage?videoId=${props.videoId}`;
    const loadImage = async () => {
        const res = await axios.get(temp);
        setImage(res.data);
    };

    const getCroppedImg = async (image) => {
        try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const centerX = image.naturalWidth / 2;
            const centerY = image.naturalHeight / 2;

            canvas.width = crop.width;
            canvas.height = crop.height;
            ctx.translate(-crop.x, -crop.y);
            ctx.translate(centerX, centerY);
            ctx.translate(-centerX, -centerY);
            ctx.drawImage(
                image,
                0,
                0,
                image.naturalWidth,
                image.naturalHeight,
                0,
                0,
                image.naturalWidth,
                image.naturalHeight
            );

            const b64 = canvas.toDataURL("image/jpeg", 1);
            return b64;
        } catch (e) {
            console.log(e);
        }
    };

    const sendCrop = async (crop, videoId, imageId, contributor, image) => {
        console.log(image);
        await axios.post(`${process.env.REACT_APP_API_ROUTE}/crop`, {
            videoId: videoId,
            imageId: imageId,
            x: crop.x,
            y: crop.y,
            width: crop.width,
            height: crop.height,
            annotationClass: "paimon",
            contributorId: contributor,
            timestamp: Math.floor(+new Date()),
            base64Image: image,
        });
    };

    const onClickCrop = async () => {
        const b64 = await getCroppedImg(imgRef.current);

        try {
            await sendCrop(
                completedCrop,
                props.videoId,
                image.name,
                props.contributorId,
                b64
            );
            setRefresh(true);
        } catch (e) {
            console.log("Send crop failed");
        }
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
            console.log("refresh");
        }
    }, [refresh]);

    function onImageLoad(e) {
        const { width, height } = e.currentTarget;
        setImageLoaded(true);
        setCrop(centerAspectCrop(width, height, 1));
        setDimensions({
            width: e.target.naturalWidth,
            height: e.target.naturalHeight,
        });
    }

    return (
        <>
            <Paper
                elevation={12}
                sx={{
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <Box component={"div"} textAlign={"center"}>
                    <Typography variant={"h4"}>{props.videoId}</Typography>
                </Box>
                <Divider />
                <Box
                    component={"div"}
                    hidden={completion !== 100}
                    sx={{ marginBottom: "1rem" }}
                >
                    <Alert severity="success">
                        This video has been completely annotated!
                    </Alert>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box
                            component={"div"}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                                height: "auto",
                            }}
                        >
                            <Box component={"div"} hidden={completion !== 100}>
                                <ReactCrop onChange={() => {}} disabled>
                                    <Box
                                        component={"img"}
                                        src={doneImage}
                                        onLoad={onImageLoad}
                                        loading={"lazy"}
                                        sx={{
                                            width: "auto",
                                            height: "auto",
                                            maxWidth: "1280px",
                                            maxHeight: "720px",
                                        }}
                                    />
                                </ReactCrop>
                            </Box>
                            <Box component={"div"} hidden={completion === 100}>
                                <ReactCrop
                                    crop={crop}
                                    onChange={(c) => {
                                        setCrop(c);
                                    }}
                                    onComplete={(c) => setCompletedCrop(c)}
                                >
                                    <Box
                                        component={"img"}
                                        ref={imgRef}
                                        crossOrigin={"anonymous"}
                                        src={image.url}
                                        onLoad={onImageLoad}
                                        loading={"lazy"}
                                        sx={{
                                            width: "auto",
                                            height: "auto",
                                            maxWidth: "1280px",
                                            maxHeight: "720px",
                                        }}
                                    />
                                    <Box component={"div"} hidden={imageLoaded}>
                                        <Skeleton
                                            width={dimensions.width}
                                            height={dimensions.height}
                                            maxWidth={1280}
                                            maxHeight={720}
                                            variant={"rectangular"}
                                        />
                                    </Box>
                                </ReactCrop>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            component={"div"}
                            sx={{ display: "flex", justifyContent: "center" }}
                        >
                            <Typography variant={"caption"}>
                                {image.name}
                            </Typography>
                            <Box component={"div"} hidden={!!image.name}>
                                <Skeleton variant={"caption"} width={"20rem"} />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            component={"div"}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "1rem",
                            }}
                        >
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
                                disabled={completion >= 100}
                            >
                                skip
                            </Button>
                            <Button
                                onClick={onClickCrop}
                                color={"primary"}
                                variant={"contained"}
                                disabled={completion >= 100}
                            >
                                Crop
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
}
