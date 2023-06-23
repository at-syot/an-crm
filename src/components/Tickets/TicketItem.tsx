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

type TicketItemProps = {
  key: string;
  ticket: TicketWithImagesDTO;
};
export default function TicketItem({
  key,
  ticket: { uAt, currentStatus, name },
}: TicketItemProps) {
  return (
    <div key={key} className={styles.ticketListItem}>
      <ListItemButton style={{ gap: "1rem" }}>
        <ListItemText
          className={styles.ticketItemStatus}
          // @ts-ignore
          secondary={uAt}
        >
          <Chip label={currentStatus} />
        </ListItemText>
        <div className={styles.ticketItemDivider} />
        <ListItemText primary={name} />
        <ListItemIcon>
          <ChevronRight />
        </ListItemIcon>
      </ListItemButton>
      <Divider />
    </div>
  );
}
