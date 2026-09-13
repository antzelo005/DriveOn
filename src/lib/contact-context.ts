import { createContext, useContext } from "react";
import type { LicenceId } from "../data/content";
export const ContactContext = createContext({
  category: "" as LicenceId | "",
  setCategory: (_category: LicenceId | "") => {},
  explain: () => {},
});
export const useContactCategory = () => useContext(ContactContext);
