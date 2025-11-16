const headerLines = [
  { label: "First Name", value: "Dan" },
  { label: "Last Name", value: "Donahue" },
  { label: "Title", value: "Baker, Electrician, Manager" },
  { label: "Phone Number", value: "312.953.7098" },
  { label: "Email", value: "macdonahue@mac.com" },
];

const contactMethods = [
  { label: "Phone", value: "312.953.7098" },
  { label: "Email", value: "macdonahue@mac.com" },
];

export default function Home() {
  return (
    <main className="relative z-10 w-full max-w-lg">
      <article className="card-panel relative z-10 mx-auto w-full max-w-sm border border-white/10 px-7 py-8">

        <header className="mb-6 space-y-2 border-b border-white/10 pb-4">
          {headerLines.map((line) => (
            <p
              key={line.label}
              className="text-[0.72rem] uppercase tracking-[0.35em] text-text-muted"
            >
              {line.label}:
              <strong className="ml-2 text-base font-semibold tracking-normal text-text-light normal-case">
                {line.value}
              </strong>
            </p>
          ))}
        </header>

        <section className="mb-6 space-y-3" aria-label="Contact information">
          {contactMethods.map((method) => (
            <div
              key={method.label}
              className="flex items-baseline justify-between border-b border-white/10 pb-3 text-sm last:border-b-0"
            >
              <span className="text-[0.7rem] uppercase tracking-[0.28em] text-text-muted">
                {method.label}
              </span>
              <strong className="text-base font-semibold text-text-light">
                {method.value}
              </strong>
            </div>
          ))}
        </section>

        <button type="button" className="save-button">
          <span className="text-base tracking-[0.55em] text-neon">
            Save Contact
          </span>
        </button>

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
