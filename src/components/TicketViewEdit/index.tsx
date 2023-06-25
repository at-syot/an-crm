import { useAtom } from "jotai";
import { renderingPageAtom, viewingTicketAtom } from "../../states";
import {
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ChevronLeft, Clear, Delete } from "@mui/icons-material";
import styles from "./styles.module.css";

import TicketImages from "../_shared/TicketImages";

export default function TicketViewEdit() {
  const [ticket, setViewingTicket] = useAtom(viewingTicketAtom);
  const [, setRenderingPage] = useAtom(renderingPageAtom);
  const onBackBtnClick = () => {
    setViewingTicket(undefined);
    setRenderingPage("ViewTickets");
  };
  return (
    <Container className={styles.container}>
      {/* actions */}
      <Stack direction={"row"}>
        <Box className={styles.backButtonBox}>
          <IconButton onClick={onBackBtnClick}>
            <ChevronLeft />
          </IconButton>
        </Box>
        <Stack direction={"row"} gap={1}>
          <Button color="primary" variant="contained">
            Edit
          </Button>
          <Button color="error" variant="contained" startIcon={<Delete />}>
            Delete
          </Button>
        </Stack>
      </Stack>

      {/* fields */}
      <Stack className={styles.container} spacing={3}>
        <TextField
          size="small"
          label={ticket?.name}
          disabled
          helperText="Ticket name"
        />
        <TextField
          size="small"
          label={ticket?.issueName}
          disabled
          helperText={"Issue"}
        />
        <TextField
          size="medium"
          label={ticket?.detail ?? "-"}
          disabled
          helperText={"Detail"}
        />
      </Stack>

      {/* images */}
      <TicketImages imagesCountLimit={0} onImagesSelected={() => {}} />
    </Container>
  );
}
