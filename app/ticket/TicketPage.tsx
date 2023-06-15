"use client";

import getConfig from "next/config";
import {
  Box,
  Button,
  Divider,
  InputBase,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import styles from "./TicketPage.module.css";
import { ChangeEvent, useEffect, useState } from "react";

export default function TicketPage() {
  const config = getConfig();

  return (
    <Container style={{ marginTop: "2rem" }}>
      <Stack justifyContent="center" alignItems="center">
        <Typography variant="h4">Create Ticket</Typography>
      </Stack>
      <Stack style={{ marginTop: "2rem" }} spacing={3}>
        <TextField
          value={"ticket-id"}
          disabled
          size="small"
          label="Ticket-id"
        />
        <TextField select size="small" label="Select issue">
          <MenuItem key={""}>test</MenuItem>
          <MenuItem key={"a"}>menu 2</MenuItem>
        </TextField>
        <TextField multiline maxRows={4} label="Description" size="medium" />
        <Divider />
      </Stack>

      <TicketImages />
    </Container>
  );
}

function TicketImages() {
  const [selectedImages, setSelectedImages] = useState<Record<string, boolean>>(
    {}
  );
  const ticketImages = Object.keys(selectedImages);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return;
    if (!files[0]) return;

    // upload images limit
    if (Object.keys(selectedImages).length >= 3) {
      alert(`only 3 images are allowed to upload.`);
      return;
    }

    const objectURL = URL.createObjectURL(files[0]);
    setSelectedImages((record) => {
      return { ...record, [objectURL]: true };
    });
  };

  const handleClearImgBtn = (url: string) => {
    setSelectedImages((record) => {
      delete record[url];
      return { ...record };
    });
  };

  return (
    <Box style={{ marginTop: "1.5rem" }}>
      <Typography>Related ticket s images ({ticketImages.length}/3)</Typography>
      <br />
      <Stack gap={5}>
        {ticketImages.map((url, i) => {
          return (
            <Stack className={styles.selectedImage} key={url}>
              <button onClick={() => handleClearImgBtn(url)}>X</button>
              <img alt="" src={url} key={i} />
            </Stack>
          );
        })}
      </Stack>
      <input
        type="file"
        accept="image/*"
        className={styles.selectfile}
        onChange={handleFileChange}
        style={{ marginTop: "1.5rem" }}
      />
    </Box>
  );
}
