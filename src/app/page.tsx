import { SaveContactButton } from "../components/SaveContactButton";

export default function Home() {
  return (
    <main className="relative z-10 w-full max-w-lg">
      <article className="card-panel relative z-10 mx-auto w-full max-w-sm border border-white/10 px-7 py-8">
        <header className="mb-6 text-center">
          <p className="text-[0.72rem] uppercase tracking-[0.35em] text-text-muted">
            Dan Donahue
          </p>
          <p className="text-base font-semibold text-text-light">
            Get in touch to see what we can build together.
          </p>
        </header>
        <SaveContactButton />

        <footer className="mt-6 space-y-1 text-center text-[0.75rem] text-text-muted">
          <p>
            <strong className="text-text-light">Built in America, on earth.</strong>
          </p>
          <p>
            <em>Making relationships built to last, the American Way.</em>
          </p>
        </footer>
      </article>
    </main>
  );
}
