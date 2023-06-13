"use client";

import { PropsWithChildren } from "react";
import Container from "@mui/material/Container";
import { TextField, Stack, Box, Typography, Button } from "@mui/material";
import { useEffect } from "react";
import liff from "@line/liff";

export default function Wrapper(props: PropsWithChildren<{}>) {
  useEffect(() => {
    liff.ready.then(async () => {
      console.log("os", liff.getOS());

      try {
        const accessToken = liff.getAccessToken();
        if (accessToken) {
          alert(accessToken);
        }
      } catch (err) {
        console.log(err);
      }
    });

    liff.init({ liffId: "1584232670-rogRLxEd" }).then();
  }, []);
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
}
