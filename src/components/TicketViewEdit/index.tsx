import { useAtom } from "jotai";
import {
  openDeleteTicketDialogAtom,
  renderingPageAtom,
  viewingTicketAtom,
} from "../../states";
import {
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  TextField,
  Alert,
} from "@mui/material";
import { ChevronLeft, Clear, Delete, Details } from "@mui/icons-material";
import styles from "./styles.module.css";

import TicketImages from "../_shared/TicketImages";
import { useRef, useState } from "react";
import SelectIssues from "../_shared/SelectIssues";
import { useTicketsDataHandlers } from "../hooks/useTicketsDataHandlers";
import { ReqUpdateTicketDTO, UpdateTicketDTO } from "../../data.types";

export default function TicketViewEdit() {
  const [ticket, setViewingTicket] = useAtom(viewingTicketAtom);
  const [, setRenderingPage] = useAtom(renderingPageAtom);
  const [, setOpenDeleteTicketDialog] = useAtom(openDeleteTicketDialogAtom);
  const { updateTicket, fetchTickets } = useTicketsDataHandlers();

  // comp's state & editing values
  const [alertStatus, setAlertStatus] = useState<"error" | "success">(
    "success"
  );
  const [openAlert, setOpenAlert] = useState(false);
  const [ticketName, setTicketName] = useState(ticket?.name);
  const selectedIssueId = useRef("");
  const [ticketDetail, setTicketDetail] = useState(ticket?.detail);

  const [editMode, setEditMode] = useState(false);
  const onBackBtnClick = () => {
    setViewingTicket(undefined);
    setRenderingPage("ViewTickets");
  };
  const onSaveOrEditBtnClick = async () => {
    if (!editMode) {
      setEditMode(true);
      return;
    }

    if (!ticket || !ticketName) return;

    const params = {
      name: ticketName,
      issueTopicId: selectedIssueId.current,
      detail: ticketDetail,
    } satisfies ReqUpdateTicketDTO;
    const response = await updateTicket(ticket.id, params);
    if (response.errors) {
      setAlertStatus("error");
      setOpenAlert(true);
      return;
    }

    await fetchTickets();
    setRenderingPage("ViewTickets");
  };
  const onDeleteBtnClick = () => setOpenDeleteTicketDialog(true);
  const onClearBtnClick = () => setEditMode(false);

  return (
    <Container className={styles.container}>
      {/*  alert */}
      {openAlert ? (
        <Alert severity={alertStatus}>
          {alertStatus == "error" ? "save change error" : "edit success"}
        </Alert>
      ) : null}

      {/* actions */}
      <Stack direction={"row"}>
        <Box className={styles.backButtonBox}>
          <IconButton onClick={onBackBtnClick}>
            <ChevronLeft />
          </IconButton>
        </Box>
        <Stack direction={"row"} gap={1}>
          <Button
            color="primary"
            variant="contained"
            onClick={onSaveOrEditBtnClick}
          >
            {editMode ? "Save" : "Edit"}
          </Button>
          {editMode ? (
            <IconButton onClick={onClearBtnClick}>
              <Clear />
            </IconButton>
          ) : (
            <Button
              color="error"
              variant="contained"
              startIcon={<Delete />}
              onClick={onDeleteBtnClick}
            >
              Delete
            </Button>
          )}
        </Stack>
      </Stack>

      {/* fields */}
      <Stack className={styles.container} spacing={3}>
        <TextField
          size="small"
          label={editMode ? "" : ticket?.name}
          disabled={!editMode}
          value={editMode ? ticketName : ""}
          helperText="Ticket name"
          onChange={(e) => setTicketName(e.target.value)}
        />
        {editMode ? (
          <SelectIssues
            onSelected={(issueId) => {
              selectedIssueId.current = issueId;
            }}
          />
        ) : (
          <TextField
            size="small"
            label={ticket?.issueName}
            disabled={!editMode}
            helperText={"Issue"}
          />
        )}
        <TextField
          size="medium"
          label={editMode ? "" : ticket?.detail}
          disabled={!editMode}
          value={editMode ? ticketDetail : ""}
          helperText={"Detail"}
          onChange={(e) => setTicketDetail(e.target.value)}
        />
      </Stack>

      {/* images */}
      <TicketImages imagesCountLimit={0} onImageDelete={() => {}} />
    </Container>
  );
}
