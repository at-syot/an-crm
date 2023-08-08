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
import { useAtom } from "jotai";
import {
  adminAccessTokenAtom,
  fetchingAtom,
  loggedInUserAtom,
} from "../../states";
import { useRouter } from "next/router";

export default function AdminAuth() {
  const { authAdminUser, fetchAdminToken } = useUserDataFns();
  const router = useRouter();

  const [, setFetching] = useAtom(fetchingAtom);
  const [, setAdminAT] = useAtom(adminAccessTokenAtom);
  const [, setLoggedInUser] = useAtom(loggedInUserAtom);
  const [authStatus, setAuthStatus] = useState<"success" | "error">();
  const [showAuthStatus, setShowAuthStatus] = useState(false);
  const usernameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();

  async function onSubmit() {
    const usernameElmt = usernameRef.current;
    const passwordElmt = passwordRef.current;
    if (!usernameElmt || !passwordElmt) return;
    setShowAuthStatus(false);

    setFetching(true); // fetch start
    const { value: username } = usernameElmt;
    const { value: password } = passwordElmt;
    const resp = await authAdminUser(username, password);
    setShowAuthStatus(true);
    if (resp.status === "fail") {
      setAuthStatus("error");
      return;
    }

    const { accessToken } = resp.data!;
    const userInfoResponse = await fetchAdminToken(accessToken);
    setFetching(false); // fetch done

    if (userInfoResponse.status === "fail") {
      setAuthStatus("error");
      return;
    }
    const user = userInfoResponse.data!;

    setAuthStatus("success");
    setTimeout(() => {
      setShowAuthStatus(false);
      setAdminAT(accessToken);
      setLoggedInUser(user);

      router.push("/admin");
    }, 3000);
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
          <Typography
            variant="h3"
            textAlign={"center"}
            marginTop={0}
            style={{ color: "blue" }}
          >
            ANP Admin Authentication
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
