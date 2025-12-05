import { HomeView } from "@/src/view";

export const metadata = {
  title: "Shtt",
  description: "Web untuk enkripsi dan dekripsi teks menggunakan berbagai algoritma kriptografi.",
};

export default async function HomeApp() {
  return <HomeView />
}