import { string } from "yup";

export const domainSchema = string()
  .trim()
  .min(3, "Domain must be least 3 characters")
  .matches(
    /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,20}$)/g,
    "The domain name format is incorrect. Enter a valid format"
  )
  .required();
