import type { NextApiRequest } from "next";
import formidable from "formidable";
import type { Fields, Files } from "formidable";

type ParseFormDataFn = (
  req: NextApiRequest
) => Promise<{ fields: Fields; files: Files }>;
export const parseFormData: ParseFormDataFn = (req) => {
  const form = formidable({ multiples: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};
