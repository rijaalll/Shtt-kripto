// app/dash/des/page.js
import { DesView } from "@/src/view";

export const metadata = {
  title: "DES File Encryption | Shtt",
  description: "Encrypt and decrypt files (photo, video, document) locally using a DES-like stream cipher.",
};

export default function DesPage() {
  return <DesView />;
}