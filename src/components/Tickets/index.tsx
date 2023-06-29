import { Box, List, Stack, typographyClasses } from "@mui/material";
import { Typography, Container } from "@mui/material";
import { useAtom } from "jotai";

import styles from "./styles.module.css";
import TicketCreateBtn from "./TicketCreateBtn";
import { ticketsWithImagesAtom } from "../../states";
import TicketItem from "./TicketItem";

export default function TicketPage() {
  const [tickets] = useAtom(ticketsWithImagesAtom);
  return (
    <Container className={styles.container}>
      <Stack className={styles.stack}>
        <Typography variant="h5" className={styles.title}>
          Tickets ({tickets.length})
        </Typography>
        {tickets.length > 0 ? (
          <List className={styles.ticketsList}>
            {tickets.map((ticket) => (
              <TicketItem key={ticket.id} ticket={ticket} />
            ))}
          </List>
        ) : (
          <Box className={styles.ticketListEmpty}>
            <Typography>You don't open any ticket yet.</Typography>
          </Box>
        )}
        <TicketCreateBtn />
      </Stack>
    </Container>
  );
}
