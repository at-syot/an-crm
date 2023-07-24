import { NextApiResponse } from "next";

export function unProcessableEntity(res: NextApiResponse) {
  return res
    .status(422)
    .json({ errors: [{ message: "unprocessable entity" }] });
}

export function resourceNotFound(res: NextApiResponse) {
  return res.status(404).json({ errors: [{ message: "resource not found" }] });
}

export function unauthorized(res: NextApiResponse) {
  console.log("here");
  return res.status(401).json({ errors: [{ message: "unauthorized" }] });
}
