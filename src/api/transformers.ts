import type { AllTicketsWithImagesDAO, TicketWithImageDAO } from "./daos";
import type { AllTicketsWithImagesDTO, TicketWithImagesDTO } from "./dtos";

// DAO -> DTO
export type FromTicketWithImageDAO_to_FlowDAOFn = (
  daos: TicketWithImageDAO[]
) => TicketWithImagesDTO;
export const fromTicketWithImageDAO_to_FlowDTO: FromTicketWithImageDAO_to_FlowDAOFn =
  (daos) => {
    return daos.reduce((resp, dao, i) => {
      if (i == 0) {
        resp = {
          images: [],
          id: dao.ticketId,
          name: dao.name,
          merchantName: dao.merchantName,
          issueTopicId: dao.issueTopicId,
          currentStatus: dao.currentStatus,
          detail: dao.detail,
          cAt: dao.cAt,
          cBy: dao.cBy,
          uAt: dao.uAt,
          uBy: dao.uBy,
        };
      }
      resp.images.push({ uri: dao.uri });
      return resp;
    }, {} as TicketWithImagesDTO);
  };

export type FromAllTicketsWithImageDAO_to_DTOFn = (
  daos: AllTicketsWithImagesDAO
) => AllTicketsWithImagesDTO;
export const fromAllTicketsWithImageDAO_to_dto: FromAllTicketsWithImageDAO_to_DTOFn =
  (daos) => {
    return daos.reduce((ticketsDto, dao) => {
      const isTicketIdExist =
        ticketsDto.filter((dto) => dto.id == dao.ticketId).length > 0;
      const dto = {
        id: dao.ticketId,
        name: dao.name,
        currentStatus: dao.currentStatus,
        issueTopicId: dao.issueTopicId,
      } as TicketWithImagesDTO;

      if (!isTicketIdExist) {
        dto.images = [{ uri: dao.uri }];
        ticketsDto.push(dto);
      } else {
        ticketsDto.map((dto) => {
          if (dto.id == dao.ticketId) {
            dto.images.push({ uri: dao.uri });
          }
          return dto;
        });
      }
      return ticketsDto;
    }, [] as AllTicketsWithImagesDTO);
    // return [] as AllTicketsWithImagesDTO;
  };
