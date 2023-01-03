import { useCookies } from "react-cookie";
import { LoginModal } from "../components/LoginModal";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import { AvailableVideosList } from "../components/AvailableVideosList";
import { useEffect, useState } from "react";
import axios from "axios";

export function Homepage() {
    const [cookies, setCookies, removeCookies] = useCookies(["user"]);

    return (
        <div>
            <LoginModal />
            {cookies.user && (
                <>
                    <Typography variant={"h1"}>
                        Welcome back {cookies.user}
                    </Typography>
                    <AvailableVideosList />
                </>
            )}
        </div>
    );
}
