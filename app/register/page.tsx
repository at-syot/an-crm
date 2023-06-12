import { headers } from "next/headers";
import Wrapper from "./Wrapper";

const fetchDataOnServer = async () => {
  const headerList = headers();
  const lineID = headerList.get("lineID");

  return lineID;
};

export default function Register() {
  // fetchDataOnServer();
  return <Wrapper></Wrapper>;
}
