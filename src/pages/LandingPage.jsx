import { Button, Typography } from "@mui/material";

export function LandingPage() {
    return (
        <div>
            <Typography variant={"h1"}>
                Crowdmon : crowd-sourcing for Paimon dataset
            </Typography>
            <Button href={"/homepage"} variant={"contained"}>
                Get started
            </Button>
        </div>
    );
}
