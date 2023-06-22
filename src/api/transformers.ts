import type { TicketWithImageDAO } from "./daos";
import type { FlowResCreateTicketDTO } from "./dtos";

// DAO -> DTO
export type FromTicketWithImageDAO_to_FlowDAOFn = (
  daos: TicketWithImageDAO[]
) => FlowResCreateTicketDTO;
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
    }, {} as FlowResCreateTicketDTO);
  };
