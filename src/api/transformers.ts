import { getS3Client, requestShareablePresignedURL } from "../utils/aws";
import type {
  AllTicketsWithImagesDAO,
  TicketImageDAO,
  TicketImageIncludedDAO,
  TicketWithImageDAO,
} from "./daos";
import type { AllTicketsWithImagesDTO, TicketWithImagesDTO } from "./dtos";

// DAO -> DTO
export type FromTicketWithImageDAO_to_FlowDAOFn = (
  daos: TicketWithImageDAO[]
) => Promise<TicketWithImagesDTO>;
export const fromTicketWithImageDAO_to_FlowDTO: FromTicketWithImageDAO_to_FlowDAOFn =
  (daos) => {
    return daos.reduce(async (dto, dao, i) => {
      let _dto = await dto;
      _dto = i == 0 ? getInitTicketImagesDTOFrom(dao) : _dto;
      return insertTicketImage(_dto, dao);
    }, Promise.resolve({} as TicketWithImagesDTO));
  };

export type FromAllTicketsWithImageDAO_to_DTOFn = (
  daos: AllTicketsWithImagesDAO
) => Promise<AllTicketsWithImagesDTO>;
export const fromAllTicketsWithImageDAO_to_dto: FromAllTicketsWithImageDAO_to_DTOFn =
  (daos) => {
    return daos.reduce(async (ticketsDto, dao) => {
      const dtos = await ticketsDto;
      const dto = getInitTicketImagesDTOFrom(dao);
      const isTicketIdExist = dtos.filter((dto) => dto.id == dao.id).length > 0;
      if (!isTicketIdExist) {
        dtos.push(dto);
      }

      const ticketsWithPresignedImages = dtos.map(async (dto) => {
        if (dto.id == dao.id) {
          dto = await insertTicketImage(dto, dao);
        }
        return dto;
      });
      return Promise.all(ticketsWithPresignedImages);
    }, Promise.resolve([] as AllTicketsWithImagesDTO));
  };

const getInitTicketImagesDTOFrom = (dao: TicketWithImageDAO) => {
  return {
    id: dao.id,
    userId: dao.userId,
    merchantName: dao.merchantName,
    name: dao.name,
    currentStatus: dao.currentStatus,
    issueTopicId: dao.issueTopicId,
    detail: dao.detail,
    images: [],
    issueId: dao.issueId,
    issueName: dao.issueName,
    cAt: dao.cAt,
    cBy: dao.cBy,
    uAt: dao.uAt,
    uBy: dao.uBy,
  } satisfies TicketWithImagesDTO;
};

const insertTicketImage = async (
  dto: TicketWithImagesDTO,
  dao: TicketWithImageDAO
) => {
  const { imageId, uri } = dao;
  if (uri) {
    const imageWithPresignedUri = await withPresignedURL({ imageId, uri });
    dto.images.push(imageWithPresignedUri);
  }
  return { ...dto };
};

type WithPresignedURLFn = (
  image: TicketImageIncludedDAO
) => Promise<TicketImageIncludedDAO>;
const withPresignedURL: WithPresignedURLFn = async (image) => {
  const s3Client = getS3Client();
  const { uri, imageId } = image;
  const bucketPath = uri.split("//").slice(1)[0];
  const path = bucketPath.split("/").slice(1).join("/");
  const signedURL = await requestShareablePresignedURL(s3Client, path);
  return { imageId, uri: signedURL };
};
