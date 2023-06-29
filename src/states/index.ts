import { atom } from "jotai";
import type {
  AllTicketsWithImagesDTO,
  UserDTO,
  TicketWithImagesDTO,
} from "../data.types";
import { IssueTopicsAtom } from "./types";

// domain states --> to be removed soon.
export const userAtom = atom<UserDTO | undefined>(undefined);
export const issueTopicsAtom = atom<IssueTopicsAtom>({});
export const ticketsWithImagesAtom = atom<AllTicketsWithImagesDTO>([]);

// application states
export const fetchingAtom = atom(false);
export const lineAccessTokenAtom = atom<string | undefined>("");
export const viewingTicketAtom = atom<TicketWithImagesDTO | undefined>(
  undefined
);

// UI states
type RenderingPageAtomValue =
  | "Entry"
  | "Register"
  | "ViewTickets"
  | "CreateTicket"
  | "TicketViewEdit";
export const renderingPageAtom = atom<RenderingPageAtomValue>("Entry");

export const openDeleteTicketDialogAtom = atom(false);
