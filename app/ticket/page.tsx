import getConfig from "next/config";
import TicketPage from "./TicketPage";

export default function Ticket() {
  const config = getConfig()
  console.log('---------', config)
  return <TicketPage />;
}
