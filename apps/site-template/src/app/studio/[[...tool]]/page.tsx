import { Studio } from "./Studio";

export const dynamic = "force-static";
export const revalidate = 0;
export const metadata = {
  title: "Studio — OuterBox Site Template",
};

export default function StudioPage() {
  return <Studio />;
}
