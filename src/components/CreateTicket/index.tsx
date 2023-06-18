"use client";

import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
import Container from "@mui/material/Container";
import styles from "./styles.module.css";
import { useRef, useState } from "react";

import { useAtom } from "jotai";
import { renderingPageAtom } from "../../states";

import CreateTicketSelectIssue from "./CreateTicketSelectIssue";
import { defaultIssueValue } from "./CreateTicketSelectIssue";
import CreateTicketImages from "./CreateTicketImages";
import { object } from "joi";

export default function CreateTicketPage() {
  const [invalidTicketName, setInvalidTicketName] = useState<boolean>(false);
  const [invalidIssue, setInvalidIssue] = useState<boolean>(false);
  const [, setRenderingPage] = useAtom(renderingPageAtom);
  const nameInputRef = useRef<HTMLInputElement>();
  const detailInputRef = useRef<HTMLInputElement>();

  // component values
  const formValues = useRef<CreateTicketFormValues>({
    ticketName: "",
    issueId: defaultIssueValue,
    detail: "",
    images: {},
  });

  // components actions
  const { validate, onSubmit } = useOnSubmitActions();
  const onCloseBtnClick = () => setRenderingPage("ViewTickets");
  const onCreateBtnClick = () => {
    // grap description's value
    if (!detailInputRef || !detailInputRef.current) return;
    if (!nameInputRef || !nameInputRef.current) return;
    formValues.current.detail = detailInputRef.current.value;
    formValues.current.ticketName = nameInputRef.current.value;

    const { errors } = validate(formValues.current);
    if (errors.ticketName || errors.issueId) {
      setInvalidTicketName(errors.ticketName);
      setInvalidIssue(errors.issueId);
      return;
    }

    onSubmit(formValues.current);
  };

  return (
    <Container style={{ marginTop: "2rem" }}>
      <Stack direction={"row"} className={styles.actions}>
        <Button color="primary" variant="contained" onClick={onCreateBtnClick}>
          Create
        </Button>
        <Box className={styles.closeBtnBox}>
          <IconButton className={styles.closeBtn} onClick={onCloseBtnClick}>
            <Clear />
          </IconButton>
        </Box>
      </Stack>
      <Stack style={{ marginTop: "2rem" }} spacing={3}>
        <TextField
          value={"System generated"}
          disabled
          size="small"
          label="Ticket-id"
        />
        <TextField
          size="small"
          label="Ticket name"
          inputRef={nameInputRef}
          error={invalidTicketName}
        />
        <CreateTicketSelectIssue
          error={invalidIssue}
          onSelect={(issueId) => {
            formValues.current.issueId = issueId;
          }}
        />
        <TextField
          multiline
          maxRows={4}
          label="Detail.."
          size="medium"
          inputRef={detailInputRef}
        />
        <Divider />
      </Stack>

      <CreateTicketImages
        onImagesSelected={(images) => {
          formValues.current.images = images;
        }}
      />
    </Container>
  );
}

type CreateTicketFormValues = {
  ticketName: string;
  issueId: string;
  detail?: string;
  images: Record<string, File>;
};
type ValidationResult = {
  errors: { ticketName: boolean; issueId: boolean };
};
const useOnSubmitActions = () => {
  const validate: (values: CreateTicketFormValues) => ValidationResult = ({
    ticketName,
    issueId,
  }) => {
    let errors = {};
    if (ticketName.length == 0) {
      errors = { ...errors, ticketName: true };
    }

    if (issueId == defaultIssueValue) {
      errors = { ...errors, issueId: true };
    }

    return { errors } as ValidationResult;
  };

  const onSubmit = async (values: CreateTicketFormValues) => {
    const formData = Object.entries(values).reduce<FormData>(
      (formData, [key, value]) => {
        if (typeof value == "object") {
          Object.entries(value as Record<string, File>).forEach(
            ([k, file], idx) => {
              formData.append(`image_${idx}`, file);
            }
          );
        } else {
          formData.append(key, value as string);
        }

        return formData;
      },
      new FormData()
    );

    const response = await fetch("/api/tickets", {
      method: "POST",
      body: formData,
    });
    const responseJson = await response.json();
    if (response.status !== 200) {
      console.log("error", response.status);
      return;
    }
    console.log("responseJson", responseJson);
  };

  return {
    validate,
    onSubmit,
  };
};
