import { LOCATIONS } from "@/lib/locations";
import LocationLandingPage from "@/components/locations/LocationLandingPage";
import { buildPageMetadata } from "@/lib/pageMetadata";

const LOC = LOCATIONS.dallas;

export const metadata = buildPageMetadata({
  title: LOC.metaTitle,
  description: LOC.metaDescription,
  path: `/${LOC.urlSlug}`,
});

export default function DallasLocationPage() {
  return <LocationLandingPage loc={LOC} />;
}
