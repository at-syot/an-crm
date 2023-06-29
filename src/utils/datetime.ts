import dayjs from "dayjs";

// date formats
export type DATE_FORMATS = "DD/MM/YYYY" | "DD-MM-YYYY";

export const widenedTypeToDate = (date: string | Date | undefined) => {
  if (!date) return;
  return dayjs(date).toDate();
};

export const dateToStr = (date: Date, format: DATE_FORMATS) => {
  return dayjs(date).format(format);
};

export const widenedTypeToFormatedStr = (
  date: string | Date | undefined,
  defaultStr: string,
  format: DATE_FORMATS
) => {
  if (!widenedTypeToDate(date)) return defaultStr;
  return dateToStr(dayjs(date).toDate(), format);
};
