import { atom } from "jotai";

// application states
export const fetchingAtom = atom(false);
export const lineAccessTokenAtom = atom<string | undefined>("");

// UI states
type RenderingPageAtomValue = "Entry" | "Register" | "ViewTickets";
export const renderingPageAtom = atom<RenderingPageAtomValue>("Entry");
