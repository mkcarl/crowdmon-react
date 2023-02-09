import {
    Avatar,
    Box,
    CircularProgress,
    Grid,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router-dom";

dayjs.extend(relativeTime);

export function ContributionsPage() {
    const [crops, setCrops] = useState([]);
    const [contributions, setContributions] = useState({});
    const [cropsLoading, setCropsLoading] = useState(true);

    useEffect(() => {
        // fetch crops
        const getCrops = async (start) => {
            const cropsFromAPI = await axios.get(
                `${process.env.REACT_APP_API_ROUTE}/crops?start=${start || 0}`
            );
            const data = cropsFromAPI.data.crops;
            const next = cropsFromAPI.data.next;

            const existingCrops = crops;
            for (const datum of data) {
                existingCrops.push(datum);
            }
            setCrops(existingCrops);

            if (!next) {
                setCropsLoading(false);
                return;
            }
            await getCrops(next);
        };
        getCrops().then(() => {});
    }, []);

    useEffect(() => {
        // reduce into object
        const contributionsFromCrops = crops.reduce((acc, crop) => {
            if (!acc[crop.contributor_id]) acc[crop.contributor_id] = [];
            acc[crop.contributor_id].push(crop);
            return acc;
        }, {});
        for (const key of Object.keys(contributionsFromCrops)) {
            const contribs = contributionsFromCrops[key];
            //sort contribs according to timestamp
            const sorted = contribs.sort((a, b) => {
                return b.timestamp - a.timestamp;
            });
            contributionsFromCrops[key] = sorted;
        }
        setContributions(contributionsFromCrops);
    }, [cropsLoading]);

    return (
        <Box component={"div"}>
            <Navbar />
            <Box component={"div"} sx={{ padding: "1rem" }}>
                <Typography variant={"h1"}>Contribution Leaderboard</Typography>
                <Grid container>
                    <Grid item xs={0} md={3}></Grid>
                    <Grid item xs={12} md={6}>
                        {cropsLoading && (
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
                        {!cropsLoading && (
                            <List>
                                {Object.entries(contributions).map(
                                    ([key, value]) => {
                                        return (
                                            <Contribution
                                                name={key}
                                                crops={value}
                                                key={key}
                                            />
                                        );
                                    }
                                )}
                            </List>
                        )}
                    </Grid>
                    <Grid item xs={0} md={3}></Grid>
                </Grid>
            </Box>
        </Box>
    );
}

function Contribution(props) {
    return (
        <ListItemButton
            component={Link}
            to={`/contributions/${props.name}`}
            state={{ name: props.name, crops: props.crops }}
        >
            <ListItemAvatar>
                <Avatar variant={"circular"}>A</Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={props.name}
                secondary={`Latest contribution : ${dayjs(
                    props.crops[0].timestamp
                ).fromNow()}`}
            />
            <ListItemText
                primary={props.crops.length}
                sx={{ textAlign: "right" }}
            />
        </ListItemButton>
    );
}
