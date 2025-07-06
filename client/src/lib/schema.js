import { string } from "yup";

export const domainSchema = string()
  .trim()
  .lowercase()
  .min(3, "Domain must be least 3 characters")
  .matches(
    /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,20}$)/g,
    "Invalid domain format"
  )
  .required();
