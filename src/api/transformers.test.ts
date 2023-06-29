// import { des} from 'jest'
import type {
  AllTicketsWithImagesDAO,
  TicketImageDAO,
  TicketWithImageDAO,
} from "./daos";
import type { AllTicketsWithImagesDTO } from "./dtos";
import { fromAllTicketsWithImageDAO_to_dto } from "./transformers";

describe("Transformers", () => {
  it("transform AllTicketsWithImagesDAO to DTO", () => {
    const stubTicket = {
      id: "ticket",
      name: "ticketName",
      issueId: "",
      issueName: "",
      issueTopicId: "issueId",
      currentStatus: "new",
      userId: "",
      imageId: "",
      uri: "ticket_1 - uri_1",
    } satisfies TicketWithImageDAO;
    const mockDAO: AllTicketsWithImagesDAO = [
      {
        ...stubTicket,
        userId: "",
        id: "ticket_1",
        uri: "ticket_1 - uri_1",
      },
      {
        ...stubTicket,
        id: "ticket_1",
        uri: "ticket_1 - uri_2",
      },
      {
        ...stubTicket,
        id: "ticket_2",
        uri: "ticket_2 - uri_1",
      },
      {
        ...stubTicket,
        id: "ticket_2",
        uri: "ticket_2 - uri_2",
      },
      {
        ...stubTicket,
        id: "ticket_2",
        uri: "ticket_2 - uri_3",
      },
    ];

    const want: AllTicketsWithImagesDTO = [
      {
        id: "ticket_1",
        name: "ticketName",
        issueId: "",
        issueName: "",
        issueTopicId: "issueId",
        currentStatus: "new",
        userId: "",
        images: [
          { imageId: "", uri: "ticket_1 - uri_1" },
          { imageId: "", uri: "ticket_1 - uri_2" },
        ],
      },
      {
        id: "ticket_2",
        name: "ticketName",
        issueId: "",
        issueName: "",
        issueTopicId: "issueId",
        currentStatus: "new",
        userId: "",
        images: [
          { imageId: "", uri: "ticket_2 - uri_1" },
          { imageId: "", uri: "ticket_2 - uri_2" },
          { imageId: "", uri: "ticket_2 - uri_3" },
        ],
      },
    ];

    const actual = fromAllTicketsWithImageDAO_to_dto(mockDAO);
    expect(actual).toMatchObject(want);
  });
});
