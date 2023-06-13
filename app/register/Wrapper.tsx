"use client";

import { PropsWithChildren, useState } from "react";
import Container from "@mui/material/Container";
import { TextField, Stack, Box, Typography, Button } from "@mui/material";
import { useEffect } from "react";
import liff from "@line/liff";

export default function Wrapper(props: PropsWithChildren<{}>) {
  const [runningOS, setRunningOS] = useState<string>();
  const [lineAT, setLineAT] = useState<string>();
  useEffect(() => {
    liff.ready.then(async () => {
      const os = liff.getOS();
      setRunningOS(os?.toString());

      try {
        const accessToken = liff.getAccessToken();
        setLineAT(accessToken?.toString());
      } catch (err) {
        console.log(err);
      }
    });

    liff.init({ liffId: "1584232670-QOz40bj9" }).then();
  }, []);

  return (
    <Container>
      <p>liff running on OS - {runningOS}</p>
      <p>
        liff user's access-token - {lineAT ? lineAT : "Can't get lineuser's AT"}
      </p>
      <p></p>
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
