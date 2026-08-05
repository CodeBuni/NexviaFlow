export function Footer() {
  return (
    <footer className="border-t-2 border-white/10 bg-bg-secondary">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <p className="font-display text-xl font-bold">
            Nexvia <span className="text-primary">Flow</span>
          </p>
          <p className="mt-1 text-sm text-white/50">
            Retenção de pacientes para clínicas de saúde privada.
          </p>
        </div>
        <div className="text-sm text-white/50">
          <p>
            <a href="mailto:gkmarcosbonifacio@gmail.com" className="hover:text-white">
              gkmarcosbonifacio@gmail.com
            </a>
          </p>
          <p>
            <a href="tel:+351928116313" className="hover:text-white">
              +351 928 116 313
            </a>
          </p>
          <p className="mt-2">
            <a href="https://nexvia.pt" className="hover:text-white" target="_blank" rel="noreferrer">
              nexvia.pt
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
