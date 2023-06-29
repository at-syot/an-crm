import { Box, Skeleton, Stack, Typography } from "@mui/material";
import styles from "./styles.module.css";
import { useAtom } from "jotai";
import {
  openDeleteTicketDialogAtom,
  renderingPageAtom,
  viewingTicketAtom,
} from "../../../states";
import { useTicketsDataHandlers } from "../../hooks/useTicketsDataHandlers";

import ConfirmDialog from "../ConfirmDialog";
import { ChangeEvent, useEffect, useState } from "react";
import { TicketImageIncludedDTO } from "../../../data.types";
import { useTicketImageDataFns } from "../../hooks/useTicketImageDataFns";

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
  const { createTicketImage, deleteTicketImage } = useTicketImageDataFns();
  const { onDeleteConfirm } = useDeleteTicketAction();

  const [renderingTicketImages, setRenderingTicketImages] = useState<
    Record<string, TicketImageIncludedDTO>
  >({});
  const renderingTicketImagesCount = Object.keys(renderingTicketImages).length;

  useEffect(() => {
    if (!viewingTicket) return;
    const images = viewingTicket.images.reduce(
      (image, dao) => ({ ...image, [dao.uri]: { ...dao } }),
      {} as Record<string, TicketImageIncludedDTO>
    );
    setRenderingTicketImages(images);
  }, [viewingTicket]);

  const onDialogCancelClick = () => setOpenDeleteTicketDialog(false);

  // delete image
  const onDeleteImageClick = async (image: TicketImageIncludedDTO) => {
    // delete imageId api
    const { imageId, uri } = image;
    await deleteTicketImage(viewingTicket?.id ?? "", imageId, uri);

    // delete image internal rendering state
    const renderingTicketImagesCopy = { ...renderingTicketImages };
    delete renderingTicketImagesCopy[image.uri];
    setRenderingTicketImages(renderingTicketImagesCopy);
  };

  // save new image
  const onInputFileChanged = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!viewingTicket || !viewingTicket.id) return;
    if (!files) return;
    if (!files[0]) return;

    const { id: ticketId } = viewingTicket;
    const touploadFile = files[0] satisfies File;
    await createTicketImage(ticketId, touploadFile);
  };

  return (
    <>
      <ConfirmDialog
        open={openDeleteTicketDialog}
        title={"Deleting Ticket"}
        content={"Are you sure to delete the ticket ?"}
        onCancel={onDialogCancelClick}
        onConfirm={onDeleteConfirm}
      />
      <Box style={{ marginTop: "1.5rem" }}>
        <Typography>
          Related ticket s images ({renderingTicketImagesCount})
        </Typography>
        <br />
        <Stack gap={5}>
          {Object.entries(renderingTicketImages).map(([uri, image]) => {
            return (
              <TicketImage
                key={uri}
                image={image}
                onDeleteImageClick={onDeleteImageClick}
              />
            );
          })}
        </Stack>

        <input
          type="file"
          accept="image/*"
          className={styles.selectfile}
          onChange={onInputFileChanged}
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
const TicketImage = ({
  image: { uri, imageId, displayUri },
  onDeleteImageClick,
}: TicketImageProps) => {
  const [loading, setLoading] = useState(true);
  const onDeleteClick = () => onDeleteImageClick({ uri, imageId, displayUri });
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
        <img alt="" src={displayUri} onLoad={onImageLoaded} />
      </Stack>
    </>
  );
};

const useDeleteTicketAction = () => {
  const [ticket] = useAtom(viewingTicketAtom);
  const [, setRenderingPage] = useAtom(renderingPageAtom);
  const { deleteTicket, fetchTickets } = useTicketsDataHandlers();
  const [, setOpenDeleteTicketDialog] = useAtom(openDeleteTicketDialogAtom);

  return {
    onDeleteConfirm: async () => {
      if (!ticket) return;
      setOpenDeleteTicketDialog(false);
      await deleteTicket(ticket);
      await fetchTickets();
      setRenderingPage("ViewTickets");
    },
  };
};
