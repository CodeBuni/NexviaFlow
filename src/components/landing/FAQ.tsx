const faqs = [
  {
    q: 'Preciso de saber configurar automações?',
    a: 'Não. Clica em Ativar e o Nexvia Flow trata de tudo pela sua clínica.',
  },
  {
    q: 'Funciona com a minha especialidade?',
    a: 'Sim — dentária, estética, fisioterapia, psicologia, veterinária, oftalmologia e outras clínicas privadas.',
  },
  {
    q: 'Os pacientes recebem mensagens por WhatsApp?',
    a: 'Sim. Usa o WhatsApp Business da clínica com templates aprovados.',
  },
  {
    q: 'E se o pagamento falhar?',
    a: 'Há um período de graça de 7 dias para a clínica não perder acesso.',
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim. A assinatura é mensal e pode ser cancelada a qualquer momento.',
  },
]

export function FAQ() {
  return (
    <section id="faq" className="border-b-2 border-white/10 py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Perguntas frequentes</h2>
        <div className="mt-10 space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group border-2 border-white/10 bg-bg-secondary p-5 open:border-primary/40"
            >
              <summary className="cursor-pointer list-none font-display text-lg font-bold marker:content-none">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-primary transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-white/60">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
