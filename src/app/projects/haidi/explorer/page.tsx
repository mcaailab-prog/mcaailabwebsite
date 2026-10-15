import type { Metadata } from "next";
import Repository from "../components/Repository";

export const metadata: Metadata = {
  title: "ADDN Data Explorer | HAIDI",
  description:
    "Explore African disability datasets, innovations, organisations and publications on the ADDN Data Explorer.",
};

export default function ExplorerPage() {
  return <Repository />;
}
