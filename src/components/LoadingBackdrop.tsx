import { Backdrop, CircularProgress } from "@mui/material";
import { useAtom } from "jotai";
import { fetchingAtom } from "../states";

export default function LoadingBackdrop() {
  const [fetching] = useAtom(fetchingAtom);
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={fetching}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
