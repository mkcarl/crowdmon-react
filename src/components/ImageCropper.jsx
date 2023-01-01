import { useEffect, useState } from "react";
import axios from "axios";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

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

async function sendCrop(crop) {
    await axios.post("http://100.76.207.17:8000/crop", {
        videoId: "test",
        imageId: "test",
        x: crop.x,
        y: crop.y,
        width: crop.width,
        height: crop.height,
        annotationClass: "test",
        contributorId: 100,
        timestamp: new Date() / 1000,
    });
}

export function ImageCropper() {
    const [image, setImage] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [crop, setCrop] = useState(null);
    const [completedCrop, setCompletedCrop] = useState(null);

    const temp = "http://100.76.207.17:8000/randomImage?videoId=LSB3JNc4iQ4";
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
            setImage(null);
            loadImage().then(() => console.log("image refreshed"));
            setRefresh(false);
        }
    }, [refresh]);

    function onImageLoad(e) {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, 1));
    }

    if (!image) {
        return (
            <div>
                <p>Image loading</p>
            </div>
        );
    }
    return (
        <>
            <button onClick={() => setRefresh(true)}>Refresh</button>
            <button onClick={() => sendCrop(completedCrop).then()}>Crop</button>
            <div>
                <p>{image.name}</p>
                <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                >
                    <img src={image.url} onLoad={onImageLoad} />
                </ReactCrop>
            </div>
            <div>{JSON.stringify(completedCrop)}</div>
        </>
    );
}
