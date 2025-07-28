import Settings from '../../components/settings';

export default function ArtilleryPage() {
  return (
    <>
      <h1 className="sr-only">
        An interactive artillery calculator for Arma 3. Supports both MAAWS
        (redneck) and 2S9 Sochor & M4 Scorcher (classic).
      </h1>
      <Settings />
    </>
  );
}
