import LandingPageCard from "../LandingPageCard";
import SearchForm from "../SearchForm";
import Welcome from "../Welcome";

export default function LandingPage() {
  return (
    <main>
      <LandingPageCard>
        <Welcome />
      </LandingPageCard>
      <LandingPageCard>
        <SearchForm />
      </LandingPageCard>
    </main>
  );
}
