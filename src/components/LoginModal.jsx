import { Button, Modal, Paper, TextField, Typography } from "@mui/material";
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

export function LoginModal(props) {
    const [username, setUsername] = useState(null);
    const [cookies, setCookies, removeCookies] = useCookies(["user"]);

    return (
        <Modal open={!cookies.user}>
            <Paper elevation={12} style={style}>
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
                >
                    Continue
                </Button>
            </Paper>
        </Modal>
    );
}
