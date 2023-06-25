import styles from "./styles.module.css";
import type { TicketWithImagesDTO } from "../../data.types";
import {
  Chip,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { useAtom } from "jotai";
import { renderingPageAtom, viewingTicketAtom } from "../../states";

type TicketItemProps = {
  key: string;
  ticket: TicketWithImagesDTO;
};
export default function TicketItem({ key, ticket }: TicketItemProps) {
  const [, setPageRendering] = useAtom(renderingPageAtom);
  const [, setViewingTicket] = useAtom(viewingTicketAtom);
  const onTicketItemClick = () => {
    setViewingTicket(ticket);
    setPageRendering("TicketViewEdit");
  };

  return (
    <div key={key} className={styles.ticketListItem}>
      <ListItemButton style={{ gap: "1rem" }} onClick={onTicketItemClick}>
        <ListItemText
          className={styles.ticketItemStatus}
          // @ts-ignore
          secondary={ticket.uAt}
        >
          <Chip label={ticket.currentStatus} />
        </ListItemText>
        <div className={styles.ticketItemDivider} />
        <ListItemText primary={ticket.name} />
        <ListItemIcon>
          <ChevronRight />
        </ListItemIcon>
      </ListItemButton>
      <Divider />
    </div>
  );
}
