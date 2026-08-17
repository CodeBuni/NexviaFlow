export function useWhatsApp() {
  const configured = Boolean(
    import.meta.env.VITE_META_APP_ID &&
      !String(import.meta.env.VITE_META_APP_ID).includes('xxxxx'),
  )

  const connect = async () => {
    // Meta Embedded Signup (FB SDK) not wired yet — only allow explicit demo
    if (configured) {
      return {
        ok: false as const,
        reason:
          'WhatsApp Business real ainda não está ligado. Use o modo demo ou configure o Embedded Signup (MAR-23).',
      }
    }

    return {
      ok: true as const,
      demo: true as const,
      phoneId: 'demo_phone_id',
      phoneNumber: '+351 900 000 000',
    }
  }

  return { configured, connect }
}
