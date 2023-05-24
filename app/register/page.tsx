import { headers } from "next/headers";
import Wrapper from "./Wrapper";

import { PrismaClient, Prisma } from "@prisma/client";

const fetchDataOnServer = async () => {
  const headerList = headers();
  const lineID = headerList.get("lineID");

  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst({ where: { lineID: lineID ?? "" } });
  console.log("u", user);

  return lineID;
};

export default function Register() {
  // fetchDataOnServer();
  return <Wrapper></Wrapper>;
}
