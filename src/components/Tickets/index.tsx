"use client";

import styles from "./styles.module.css";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { Typography } from "@mui/material";

import TicketCreateBtn from "./TicketCreateBtn";

export default function TicketPage() {
  return (
    <Stack className={styles.stack}>
      <Typography variant="h5">Tickets</Typography>
      <List className={styles.ticketsList}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13].map(() => {
          return (
            <>
              <ListItemButton>
                <ListItemText primary="status" secondary="updatedAt" />
                <ListItemText primary="issueTopic" />
                <ListItemText primary="name" />
                <ListItemIcon>
                  <ChevronRight />
                </ListItemIcon>
              </ListItemButton>
              <Divider />
            </>
          );
        })}
      </List>
      <TicketCreateBtn />
    </Stack>
  );
}
