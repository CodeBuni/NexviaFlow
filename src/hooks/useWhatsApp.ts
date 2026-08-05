export function useWhatsApp() {
  const configured = Boolean(import.meta.env.VITE_META_APP_ID)

  const connect = async () => {
    if (!configured) {
      return {
        demo: true as const,
        phoneId: 'demo_phone_id',
        phoneNumber: '+351 900 000 000',
      }
    }

    // Meta Embedded Signup requires FB SDK + config ID in production.
    return {
      demo: false as const,
      phoneId: '',
      phoneNumber: '',
    }
  }

  return { configured, connect }
}
