import { List, Stack } from "@mui/material";
import { Typography } from "@mui/material";
import { useAtom } from "jotai";

import styles from "./styles.module.css";
import TicketCreateBtn from "./TicketCreateBtn";
import { ticketsWithImagesAtom } from "../../states";
import TicketItem from "./TicketItem";

export default function TicketPage() {
  const [tickets] = useAtom(ticketsWithImagesAtom);
  return (
    <Stack className={styles.stack}>
      <Typography variant="h5">Tickets ({tickets.length})</Typography>
      <List className={styles.ticketsList}>
        {tickets.map((ticket) => (
          <TicketItem key={ticket.id} ticket={ticket} />
        ))}
      </List>
      <TicketCreateBtn />
    </Stack>
  );
}
