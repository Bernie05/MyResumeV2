import { Archivo } from "next/font/google";

// Variable grotesk with a width axis, shared by every resume design: expanded +
// heavy for display type, a real italic in the same family for emphasis.
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  display: "swap",
});
