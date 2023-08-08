import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

export default function AdminUsers() {
  return (
    <Stack sx={{ width: "100%", paddingTop: "1rem" }} gap={2}>
      {/* super-admin & system */}
      <Typography
        color="blueviolet"
        sx={{ cursor: "pointer" }}
        onClick={() => {}}
      >
        + Register more Admin
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>#</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow
              sx={{
                "&:hover": { bgcolor: "rgb(224, 224, 224)" },
                cursor: "pointer",
              }}
              onClick={() => {
                console.log("click");
              }}
            >
              <TableCell>system</TableCell>
              <TableCell>system user</TableCell>
              <TableCell>system</TableCell>
              <TableCell>
                <IconButton color="error" size="small">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
