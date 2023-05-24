"use client";

import { PropsWithChildren } from "react";
import Container from "@mui/material/Container";
import { TextField, Stack, Box, Typography, Button } from "@mui/material";

export default (props: PropsWithChildren<{}>) => {
  return (
    <Container>
      <Box
        sx={{
          marginTop: "3rem",
          marginBottom: "5rem",
          textAlign: "center",
        }}
      >
        <Typography variant="h3">Registration</Typography>
      </Box>
      <Stack direction="column" gap={3}>
        <TextField variant="standard" label="registered phone no." />
        <TextField variant="standard" label="username" />
      </Stack>
      <Stack justifyItems="end" style={{ marginTop: "3rem" }}>
        <Button variant="contained">Submit</Button>
      </Stack>
    </Container>
  );
};
