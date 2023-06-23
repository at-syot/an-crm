import { atom } from "jotai";
import type { AllTicketsWithImagesDTO } from "../data.types";

// domain states
export type IssueTopicItemAtom = {
  active: boolean;
  id: string;
  name: string;
  parentId?: string;
};
export type IssueTopicsAtom = Record<string, IssueTopicItemAtom>;

export const issueTopicsAtom = atom<IssueTopicsAtom>({});
export const ticketsWithImagesAtom = atom<AllTicketsWithImagesDTO>([]);

// application states
export const fetchingAtom = atom(false);
export const lineAccessTokenAtom = atom<string | undefined>("");

// UI states
type RenderingPageAtomValue =
  | "Entry"
  | "Register"
  | "ViewTickets"
  | "CreateTicket";
export const renderingPageAtom = atom<RenderingPageAtomValue>("Entry");
