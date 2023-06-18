import { Box, Stack, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

type CreateTicketImagesProps = {
  onImagesSelected: (images: Record<string, File>) => void;
};
export default function CreateTicketImages(props: CreateTicketImagesProps) {
  const selectedImagesRef = useRef<Record<string, File>>({});
  const [selectedImages, setSelectedImages] = useState<Record<string, boolean>>(
    {}
  );
  const ticketImages = Object.keys(selectedImages);

  // handle input file on change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return;
    if (!files[0]) return;

    // upload images limit
    if (Object.keys(selectedImages).length >= 3) {
      alert(`only 3 images are allowed to upload.`);
      return;
    }

    // create temporary file's url from file
    const objectURL = URL.createObjectURL(files[0]);

    // append to selectedImageRef
    selectedImagesRef.current[objectURL] = files[0];

    // append to component state for rendering
    setSelectedImages((prevSelectedImages) => {
      return { ...prevSelectedImages, [objectURL]: true };
    });

    props.onImagesSelected(selectedImagesRef.current);
  };

  const handleClearImgBtn = (url: string) => {
    setSelectedImages((record) => {
      delete record[url];
      return { ...record };
    });
  };

  return (
    <Box style={{ marginTop: "1.5rem" }}>
      <Typography>Related ticket s images ({ticketImages.length}/3)</Typography>
      <br />
      <Stack gap={5}>
        {ticketImages.map((url, i) => {
          return (
            <Stack className={styles.selectedImage} key={url}>
              <button onClick={() => handleClearImgBtn(url)}>X</button>
              <img alt="" src={url} key={i} />
            </Stack>
          );
        })}
      </Stack>
      <input
        type="file"
        accept="image/*"
        className={styles.selectfile}
        onChange={handleFileChange}
        style={{ marginTop: "1.5rem" }}
      />
    </Box>
  );
}
