import {
  Container,
  Stack,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useUserDataFns } from "../hooks/useUserDataFns";
import { useRef, useState } from "react";
import { isClientFailResponse, isClientSuccessResponse } from "../../client";
import { useAtom } from "jotai";
import { adminAccessTokenAtom } from "../../states";
import { useRouter } from "next/router";

export default function AdminAuth() {
  const { adminUserAuth } = useUserDataFns();
  const router = useRouter();

  const [, setAdminAT] = useAtom(adminAccessTokenAtom);
  const [authStatus, setAuthStatus] = useState<"success" | "error">();
  const [showAuthStatus, setShowAuthStatus] = useState(false);
  const usernameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();

  async function onSubmit() {
    const usernameElmt = usernameRef.current;
    const passwordElmt = passwordRef.current;
    if (!usernameElmt || !passwordElmt) return;
    setShowAuthStatus(false);

    const { value: username } = usernameElmt;
    const { value: password } = passwordElmt;
    const resp = await adminUserAuth(username, password);

    setShowAuthStatus(true);
    if (isClientFailResponse(resp)) {
      setAuthStatus("error");
      return;
    }

    if (isClientSuccessResponse<{ accessToken: string }>(resp)) {
      if (!resp.data) return;
      const { accessToken } = resp.data;

      setAuthStatus("success");
      setTimeout(() => {
        setShowAuthStatus(false);
        setAdminAT(accessToken);
        router.push("/admin");
      }, 3000);
    }
  }

  return (
    <>
      <Container>
        <Stack bgcolor={"AppWorkspace"} height={"100px"}>
          <Alert
            security={authStatus}
            color={authStatus}
            style={{
              marginTop: "auto",
              marginBottom: "auto",
              display: showAuthStatus ? "inline-block" : "none",
            }}
          >
            {authStatus === "success"
              ? "Authentication success."
              : "Username or Password is incorrect."}
          </Alert>
        </Stack>
        <Stack
          direction={"column"}
          padding={4}
          marginLeft={"auto"}
          marginRight={"auto"}
          maxWidth={"640px"}
          spacing={4}
        >
          <Typography variant="h3" textAlign={"center"} marginTop={0}>
            ANP admin auth
          </Typography>

          <TextField
            variant="standard"
            label="Username"
            size="medium"
            inputRef={usernameRef}
          ></TextField>
          <TextField
            variant="standard"
            label="Password"
            size="medium"
            type="password"
            inputRef={passwordRef}
          ></TextField>

          <Box textAlign={"right"}>
            <Button variant="contained" onClick={onSubmit}>
              Login
            </Button>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
