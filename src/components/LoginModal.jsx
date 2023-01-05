import {
    Box,
    Button,
    Modal,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    padding: "2rem",
};

export function LoginModal() {
    const [username, setUsername] = useState(null);
    const [cookies, setCookies, removeCookies] = useCookies(["user"]);
    return (
        <Modal open={!cookies.user}>
            <Paper elevation={12} style={style}>
                <Box
                    component={"div"}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                    }}
                >
                    <Typography variant={"h4"} textAlign={"center"}>
                        Login
                    </Typography>
                    <TextField
                        name={"username"}
                        label={"Plese insert your username"}
                        variant={"filled"}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button
                        disabled={!username}
                        color={"primary"}
                        variant={"contained"}
                        onClick={() => {
                            setCookies("user", username);
                        }}
                        autoFocus={true}
                        sx={{ alignSelf: "flex-end" }}
                    >
                        Continue
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
}
