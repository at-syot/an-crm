"use client";

import { PropsWithChildren, useRef, useState } from "react";
import { useAtom } from "jotai";
import { fetchingAtom, renderingPageAtom } from "../../states";
import Container from "@mui/material/Container";
import {
  Alert,
  TextField,
  Stack,
  Box,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";

type RegisterProps = PropsWithChildren<{ lineAT: string }>;
export default function Register(props: RegisterProps) {
  const [fetching, setFetching] = useAtom(fetchingAtom);
  const [, setRenderingPage] = useAtom(renderingPageAtom);
  const [registerStatus, setRegisterStatus] = useState<"success" | "error">();

  const phoneNoRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const anpATRef = useRef<HTMLInputElement>(null);

  const [displayAlert, setDisplayAlert] = useState(false);
  const [phoneNoValid, setPhoneNoValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);

  const setRegisterStatusAlert = (registerStatus: boolean) => {
    setDisplayAlert(true);
    setTimeout(() => {
      if (registerStatus == true) {
        setDisplayAlert(false);
      }
    }, 2000);
  };

  const onSubmit = async () => {
    if (!phoneNoRef.current || !emailRef.current || !anpATRef.current) return;
    const phoneNo = phoneNoRef.current.value;
    const email = emailRef.current.value;
    const anpAT = anpATRef.current.value; // will be used in the future
    const { lineAT } = props;

    // fields validation
    const isValid = (src: string) => src !== null && src.length > 0;
    setPhoneNoValid(isValid(phoneNo));
    setEmailValid(isValid(email));
    if (!isValid(phoneNo) || !isValid(email)) return;

    // call register ui
    setFetching(true);
    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: { ["Content-Type"]: "application/json" },
      body: JSON.stringify({ phoneNo, email, lineAT }),
    });
    const responseJSON = await response.json();
    setFetching(false);

    if (response.status != 200) {
      setRegisterStatus("error");
      setRegisterStatusAlert(false);
    } else {
      setRegisterStatus("success");
      setRegisterStatusAlert(true);

      // block for 3 secs, and switch to ViewTickets page
      setTimeout(() => {
        setRenderingPage("ViewTickets");
      }, 2500);
    }
  };

  return (
    <Container>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={fetching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {displayAlert ? (
        <Alert severity={registerStatus}>
          {registerStatus == "success" ? "Register success." : "Register fails"}
        </Alert>
      ) : null}
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
        <TextField
          variant="standard"
          label="Phone no."
          inputRef={phoneNoRef}
          error={!phoneNoValid}
        />
        <TextField
          variant="standard"
          label="Email"
          inputRef={emailRef}
          error={!emailValid}
        />
        <TextField
          variant="standard"
          label="ANP access token"
          inputRef={anpATRef}
        />
      </Stack>
      <Stack justifyItems="end" style={{ marginTop: "3rem" }}>
        <Button variant="contained" onClick={onSubmit}>
          Submit
        </Button>
      </Stack>
    </Container>
  );
}
