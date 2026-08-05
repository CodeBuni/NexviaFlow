const provas = [
  { value: '40%', label: 'menos faltas nas clínicas que usam' },
  { value: '€8.500', label: 'média mensal recuperada' },
  { value: '87%', label: 'taxa média de confirmação' },
]

export function MetricasProva() {
  return (
    <section className="border-b-2 border-white/10 bg-bg-secondary py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Cada falta evitada é dinheiro no seu bolso.
        </h2>
        <p className="mt-3 max-w-2xl text-white/60">
          Clínicas que usam o Nexvia Flow reduzem faltas e preenchem vagas sem
          ligar manualmente a cada paciente.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {provas.map((item) => (
            <div
              key={item.label}
              className="border-2 border-primary/30 bg-primary/5 p-6 shadow-brutal"
            >
              <p className="font-display text-4xl font-bold text-primary">{item.value}</p>
              <p className="mt-2 text-white/60">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
