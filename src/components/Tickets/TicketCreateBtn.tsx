import { AddBox } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import styles from "./styles.module.css";

import { useAtom } from "jotai";
import { renderingPageAtom } from "../../states";

export default function TicketCreateBtn() {
  const [, setRenderingPage] = useAtom(renderingPageAtom);
  const onClick = () => setRenderingPage("CreateTicket");

  return (
    <Box className={styles.createWrapper}>
      <IconButton aria-label="create ticket" size="large" onClick={onClick}>
        <AddBox fontSize="inherit" color="primary" />
      </IconButton>
      <Typography variant="button">Create Ticket</Typography>
    </Box>
  );
}
