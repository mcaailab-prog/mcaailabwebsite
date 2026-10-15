import type { Metadata } from "next";
import HaidiHome from "./components/HaidiHome";

export const metadata: Metadata = {
  title: "HAIDI | Hub for AI and Disability Inclusion",
  description:
    "The Hub for AI and Disability Inclusion (HAIDI): events, publications, partnerships and the ADDN Data Explorer.",
};

export default function HaidiPage() {
  return <HaidiHome />;
}
