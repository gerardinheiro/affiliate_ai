export type Locale = 'pt-BR' | 'en'

export const translations = {
    'pt-BR': {
        // Landing Page
        'landing.title': 'AffiliateAI',
        'landing.subtitle': 'Sua plataforma de automação de vendas.',
        'landing.login': 'Entrar',
        'landing.start': 'Começar Grátis',
        'landing.dashboard': 'Ir para Dashboard',
        'landing.features': 'Funcionalidades',
        'landing.howItWorks': 'Como Funciona',
        'landing.pricing': 'Preços',

        // Features
        'features.title': 'Tudo que você precisa para escalar suas vendas',
        'features.subtitle': 'Ferramentas poderosas de IA para automatizar seu marketing de afiliados',

        // Common
        'common.loading': 'Carregando...',
        'common.save': 'Salvar',
        'common.cancel': 'Cancelar',
        'common.delete': 'Excluir',
        'common.edit': 'Editar',
    },
    'en': {
        // Landing Page
        'landing.title': 'AffiliateAI',
        'landing.subtitle': 'Your sales automation platform.',
        'landing.login': 'Login',
        'landing.start': 'Start Free',
        'landing.dashboard': 'Go to Dashboard',
        'landing.features': 'Features',
        'landing.howItWorks': 'How It Works',
        'landing.pricing': 'Pricing',

        // Features
        'features.title': 'Everything you need to scale your sales',
        'features.subtitle': 'Powerful AI tools to automate your affiliate marketing',

        // Common
        'common.loading': 'Loading...',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        export type Locale = 'pt-BR' | 'en'

export const translations = {
            'pt-BR': {
                // Landing Page
                'landing.title': 'AffiliateAI',
                'landing.subtitle': 'Sua plataforma de automação de vendas.',
                'landing.login': 'Entrar',
                'landing.start': 'Começar Grátis',
                'landing.dashboard': 'Ir para Dashboard',
                'landing.features': 'Funcionalidades',
                'landing.howItWorks': 'Como Funciona',
                'landing.pricing': 'Preços',

                // Features
                'features.title': 'Tudo que você precisa para escalar suas vendas',
                'features.subtitle': 'Ferramentas poderosas de IA para automatizar seu marketing de afiliados',

                // Common
                'common.loading': 'Carregando...',
                'common.save': 'Salvar',
                'common.cancel': 'Cancelar',
                'common.delete': 'Excluir',
                'common.edit': 'Editar',
            },
            'en': {
                // Landing Page
                'landing.title': 'AffiliateAI',
                'landing.subtitle': 'Your sales automation platform.',
                'landing.login': 'Login',
                'landing.start': 'Start Free',
                'landing.dashboard': 'Go to Dashboard',
                'landing.features': 'Features',
                'landing.howItWorks': 'How It Works',
                'landing.pricing': 'Pricing',

                // Features
                'features.title': 'Everything you need to scale your sales',
                'features.subtitle': 'Powerful AI tools to automate your affiliate marketing',

                // Common
                'common.loading': 'Loading...',
                'common.save': 'Save',
                'common.cancel': 'Cancel',
                'common.delete': 'Delete',
                'common.edit': 'Edit',
            }
        }

export function getTranslation(locale: Locale, key: string): string {
        const localeTranslations = translations[locale] as Record<string, string>
  return localeTranslations[key] || key
}
