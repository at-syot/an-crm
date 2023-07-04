import { Box, Skeleton, Stack, Typography } from "@mui/material";
import styles from "./styles.module.css";
import { useAtom } from "jotai";
import {
  openDeleteTicketDialogAtom,
  renderingPageAtom,
  viewingTicketAtom,
} from "../../../states";

import ConfirmDialog from "../ConfirmDialog";
import { useEffect, useState } from "react";
import { useTicketImageDataFns } from "../../hooks/useTicketImageDataFns";
import type { TicketImageIncludedDTO } from "../../../data.types";
import {
  useOnInputFileChangeAction,
  useDeleteTicketAction,
  useOnDeleteTicketImageAction,
} from "./hooks";

// move to TicketViewEdit component
type TicketImagesProps = {
  imagesCountLimit: number;
  onImageDelete: (images: Record<string, File>) => void;
};
export default function TicketImages(props: TicketImagesProps) {
  const [openDeleteTicketDialog, setOpenDeleteTicketDialog] = useAtom(
    openDeleteTicketDialogAtom
  );
  const [viewingTicket] = useAtom(viewingTicketAtom);

  const { onInputFileChange } = useOnInputFileChangeAction();
  const { onDeleteTicketConfirm } = useDeleteTicketAction();
  const { onDeleteTicketImageClick } = useOnDeleteTicketImageAction();
  const onDialogCancelClick = () => setOpenDeleteTicketDialog(false);

  return (
    <>
      <ConfirmDialog
        open={openDeleteTicketDialog}
        title={"Deleting Ticket"}
        content={"Are you sure to delete the ticket ?"}
        onCancel={onDialogCancelClick}
        onConfirm={onDeleteTicketConfirm}
      />
      <Box style={{ marginTop: "1.5rem" }}>
        <Typography>
          Related ticket s images ({viewingTicket?.images.length ?? 0})
        </Typography>
        <br />
        <Stack gap={5}>
          {viewingTicket?.images.map((image) => {
            return (
              <TicketImage
                key={image.uri}
                image={image}
                onDeleteImageClick={onDeleteTicketImageClick}
              />
            );
          })}
        </Stack>

        <input
          type="file"
          accept="image/*"
          className={styles.selectfile}
          onChange={onInputFileChange}
          style={{ marginTop: "1.5rem" }}
        />
      </Box>
    </>
  );
}

type TicketImageProps = {
  image: TicketImageIncludedDTO;
  onDeleteImageClick: (image: TicketImageIncludedDTO) => void;
};
const TicketImage = ({ image, onDeleteImageClick }: TicketImageProps) => {
  const [loading, setLoading] = useState(true);
  const onDeleteClick = () => onDeleteImageClick(image);
  const onImageLoaded = () => setLoading(() => false);

  return (
    <>
      {loading ? (
        <Skeleton
          variant="rectangular"
          width={"100%"}
          height={loading ? "10rem" : 0}
        />
      ) : null}
      <Stack
        className={styles.selectedImage}
        style={{ height: loading ? 0 : "auto" }}
      >
        <button onClick={onDeleteClick}>X</button>
        <img alt="" src={image.displayUri} onLoad={onImageLoaded} />
      </Stack>
    </>
  );
};
