// import { des} from 'jest'
import type { AllTicketsWithImagesDAO } from "./daos";
import type { AllTicketsWithImagesDTO } from "./dtos";
import { fromAllTicketsWithImageDAO_to_dto } from "./transformers";

describe("Transformers", () => {
  it("transform AllTicketsWithImagesDAO to DTO", () => {
    const stubTicket = {
      id: "ticket",
      name: "ticketName",
      issueTopicId: "issueId",
      currentStatus: "new",
      uri: "ticket_1 - uri_1",
      ticketId: "ticket",
    };
    const mockDAO: AllTicketsWithImagesDAO = [
      {
        ...stubTicket,
        id: "ticket_1",
        ticketId: "ticket_1",
        uri: "ticket_1 - uri_1",
      },
      {
        ...stubTicket,
        id: "ticket_1",
        ticketId: "ticket_1",
        uri: "ticket_1 - uri_2",
      },
      {
        ...stubTicket,
        id: "ticket_2",
        ticketId: "ticket_2",
        uri: "ticket_2 - uri_1",
      },
      {
        ...stubTicket,
        id: "ticket_2",
        ticketId: "ticket_2",
        uri: "ticket_2 - uri_2",
      },
      {
        ...stubTicket,
        id: "ticket_2",
        ticketId: "ticket_2",
        uri: "ticket_2 - uri_3",
      },
    ];

    const want: AllTicketsWithImagesDTO = [
      {
        id: "ticket_1",
        name: "ticketName",
        issueTopicId: "issueId",
        currentStatus: "new",
        images: [{ uri: "ticket_1 - uri_1" }, { uri: "ticket_1 - uri_2" }],
      },
      {
        id: "ticket_2",
        name: "ticketName",
        issueTopicId: "issueId",
        currentStatus: "new",
        images: [
          { uri: "ticket_2 - uri_1" },
          { uri: "ticket_2 - uri_2" },
          { uri: "ticket_2 - uri_3" },
        ],
      },
    ];

    const actual = fromAllTicketsWithImageDAO_to_dto(mockDAO);
    expect(actual).toMatchObject(want);
  });
});
