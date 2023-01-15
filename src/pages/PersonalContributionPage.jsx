import { Navbar } from "../components/Navbar";
import {
    Box,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Pagination,
    Paper,
    Typography,
    useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
    Chart,
    ArcElement,
    Tooltip,
    Legend,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    TimeScale,
    CategoryScale,
    BarElement,
} from "chart.js";
import "chartjs-adapter-moment";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { Crop } from "@mui/icons-material";
dayjs.extend(isBetween);
Chart.register(
    ArcElement,
    Tooltip,
    Legend,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    TimeScale,
    CategoryScale,
    BarElement
);

const borderColors = [
    "rgb(178, 204, 12)",
    "rgb(112, 61, 78)",
    "rgb(22, 1, 175)",
    "rgb(108, 114, 102)",
    "rgb(188, 130, 221)",
    "rgb(155, 138, 153)",
    "rgb(6, 7, 38)",
    "rgb(150, 204, 89)",
    "rgb(83, 96, 77)",
    "rgb(201, 175, 151)",
    "rgb(0, 0, 0)",
    "rgb(32, 45, 22)",
    "rgb(35, 28, 45)",
    "rgb(179, 224, 216)",
    "rgb(211, 153, 150)",
    "rgb(53, 60, 112)",
    "rgb(179, 198, 201)",
    "rgb(149, 139, 183)",
    "rgb(198, 156, 117)",
    "rgb(162, 141, 168)",
    "rgb(19, 0, 45)",
    "rgb(50, 73, 47)",
    "rgb(36, 38, 51)",
    "rgb(67, 92, 107)",
    "rgb(102, 124, 13)",
    "rgb(216, 92, 75)",
    "rgb(47, 96, 25)",
    "rgb(27, 34, 73)",
    "rgb(6, 33, 12)",
    "rgb(249, 0, 66)",
    "rgb(2, 2, 2)",
    "rgb(221, 221, 221)",
    "rgb(105, 165, 71)",
    "rgb(149, 173, 105)",
    "rgb(234, 60, 168)",
    "rgb(124, 119, 77)",
    "rgb(86, 56, 13)",
    "rgb(110, 72, 117)",
    "rgb(35, 13, 18)",
    "rgb(76, 57, 31)",
];

const colors = [
    "rgba(178, 204, 1,0.5)",
    "rgba(112, 61, 7,0.5)",
    "rgba(22, 1, 17,0.5)",
    "rgba(108, 114, 10,0.5)",
    "rgba(188, 130, 22,0.5)",
    "rgba(155, 138, 15,0.5)",
    "rgba(6, 7, 3,0.5)",
    "rgba(150, 204, 8,0.5)",
    "rgba(83, 96, 7,0.5)",
    "rgba(201, 175, 15,0.5)",
    "rgba(0, 0, 0,0.5)",
    "rgba(32, 45, 2,0.5)",
    "rgba(35, 28, 4,0.5)",
    "rgba(179, 224, 21,0.5)",
    "rgba(211, 153, 15,0.5)",
    "rgba(53, 60, 11,0.5)",
    "rgba(179, 198, 20,0.5)",
    "rgba(149, 139, 18,0.5)",
    "rgba(198, 156, 11,0.5)",
    "rgba(162, 141, 16,0.5)",
    "rgba(19, 0, 4,0.5)",
    "rgba(50, 73, 4,0.5)",
    "rgba(36, 38, 5,0.5)",
    "rgba(67, 92, 10,0.5)",
    "rgba(102, 124, 1,0.5)",
    "rgba(216, 92, 7,0.5)",
    "rgba(47, 96, 2,0.5)",
    "rgba(27, 34, 7,0.5)",
    "rgba(6, 33, 1,0.5)",
    "rgba(249, 0, 6,0.5)",
    "rgba(2, 2, 2 ,0.5)",
    "rgba(221, 221, 22,0.5)",
    "rgba(105, 165, 7,0.5)",
    "rgba(149, 173, 10,0.5)",
    "rgba(234, 60, 16,0.5)",
    "rgba(124, 119, 7,0.5)",
    "rgba(86, 56, 1,0.5)",
    "rgba(110, 72, 11,0.5)",
    "rgba(35, 13, 1,0.5)",
    "rgba(76, 57, 3,0.5)",
];

export function PersonalContributionPage(props) {
    const location = useLocation();
    const theme = useTheme();
    const { name, crops } = location.state;
    const [cropsByVideo, setCropsByVideo] = useState({});
    const [doughnutData, setDoughnutData] = useState({});
    const [doughnutDataLoaded, setDoughnutDataLoaded] = useState(false);
    const [lineData, setLineData] = useState({});
    const [lineDataLoaded, setLineDataLoaded] = useState(false);
    const [chartDimensions, setChartDimensions] = useState({
        width: 300,
        height: 300,
    });
    const [page, setPage] = useState(1);
    const pageLength = 8;

    useEffect(() => {
        const reduced = crops.reduce((acc, crop) => {
            if (!acc[crop.video_id]) acc[crop.video_id] = [];
            acc[crop.video_id].push(crop);
            return acc;
        }, {});
        setCropsByVideo(reduced);

        const today = dayjs().startOf("day"); // set to 12:00 am today
        // loop from 1 to 7
        const days = Array.from({ length: 7 }, (_, i) =>
            today.subtract(i, "day")
        ).reverse();

        const cropFrequency = days.map((day) => {
            const nextDay = day.add(1, "day");
            const cropsOnDay = crops.filter((crop) => {
                const cropDate = dayjs(crop.timestamp * 1000);
                return cropDate.isBetween(day, nextDay);
            });
            return cropsOnDay.length;
        });

        const draftLinedata = {
            labels: days.map((day) => day.format("MMM D")),
            datasets: [
                {
                    label: "Crop Times",
                    data: cropFrequency,
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: theme.palette.primary.main,
                    borderWidth: 1,
                },
            ],
            options: {
                scales: {
                    x: {
                        type: "time",
                    },
                },
            },
            hoverOffset: 4,
        };
        console.log(draftLinedata);
        setLineData(draftLinedata);
    }, []);

    useEffect(() => {
        if (Object.keys(cropsByVideo).length === 0) return;
        const labels = Object.keys(cropsByVideo);
        const data = Object.values(cropsByVideo).map((crops) => crops.length);
        setDoughnutData({
            labels,
            datasets: [
                {
                    label: "Crops per video",
                    data,
                    backgroundColor: colors.slice(0, data.length),
                    borderColor: borderColors.slice(0, data.length),
                },
            ],
            hoverOffset: 4,
        });
    }, [cropsByVideo]);

    useEffect(() => {
        setDoughnutDataLoaded(Object.keys(doughnutData).length !== 0);
    }, [doughnutData]);

    useEffect(() => {
        setLineDataLoaded(Object.keys(lineData).length !== 0);
    }, [lineData]);

    return (
        <Box component={"div"}>
            <Navbar />
            <Box component={"div"} sx={{ padding: "1rem" }}>
                <h1>{name}'s Contribution</h1>
                <Grid container spacing={2}>
                    <Grid
                        item
                        md={6}
                        sx={{
                            width: "100%",
                        }}
                    >
                        <Paper elevation={1}>
                            <Box
                                component={"div"}
                                sx={{
                                    padding: "1rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Typography variant={"h4"}>
                                    Contributions per video
                                </Typography>
                                <Box
                                    component={"div"}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        width: "100%",
                                        height: "30vh",
                                    }}
                                >
                                    {doughnutDataLoaded && (
                                        <Doughnut
                                            data={doughnutData}
                                            options={{
                                                maintainAspectRatio: false,
                                            }}
                                        />
                                    )}
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid
                        item
                        md={6}
                        sx={{
                            width: "100%",
                        }}
                    >
                        <Paper elevation={1}>
                            <Box
                                component={"div"}
                                sx={{
                                    padding: "1rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Typography variant={"h4"}>
                                    Past 7 days contributions
                                </Typography>
                                <Box
                                    component={"div"}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        width: "100%",
                                        height: "30vh",
                                    }}
                                >
                                    {lineDataLoaded && (
                                        <Bar
                                            data={lineData}
                                            options={{
                                                maintainAspectRatio: false,
                                            }}
                                        />
                                    )}
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper
                            elevation={1}
                            sx={{
                                padding: "1rem",
                                gap: "1rem",
                            }}
                        >
                            <Typography variant={"h4"} textAlign={"center"}>
                                Crop details
                            </Typography>
                            <Divider />
                            <List>
                                {Object.values(
                                    crops.slice(
                                        page * pageLength,
                                        page * pageLength + pageLength
                                    )
                                ).map((crop) => (
                                    <ListItem>
                                        <ListItemIcon>
                                            <Crop color={"secondary"} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={crop.video_id}
                                            secondary={dayjs(
                                                crop.timestamp * 1000
                                            ).format("DD MMM YYYY (HH:mm:ss)")}
                                        />
                                        <Chip
                                            label={crop.annotation_class}
                                            color={
                                                crop.annotation_class === "none"
                                                    ? "error"
                                                    : "primary"
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <Pagination
                                count={Math.ceil(crops.length / pageLength) - 1}
                                size={"large"}
                                page={page}
                                onChange={(e, v) => {
                                    setPage(v);
                                }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
