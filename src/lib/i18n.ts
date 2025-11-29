export type Locale = 'pt-BR' | 'en' | 'ja' | 'fil' | 'hi'

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
        export type Locale = 'pt-BR' | 'en' | 'ja' | 'fil' | 'hi'

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
            },
            'ja': {
                // Landing Page
                'landing.title': 'AffiliateAI',
                'landing.subtitle': 'セールス自動化プラットフォーム',
                'landing.login': 'ログイン',
                'landing.start': '無料で始める',
                'landing.dashboard': 'ダッシュボードへ',
                'landing.features': '機能',
                'landing.howItWorks': '使い方',
                'landing.pricing': '料金',

                // Features
                'features.title': '売上を拡大するために必要なすべて',
                'features.subtitle': 'アフィリエイトマーケティングを自動化する強力なAIツール',

                // Common
                'common.loading': '読み込み中...',
                'common.save': '保存',
                'common.cancel': 'キャンセル',
                'common.delete': '削除',
                'common.edit': '編集',
            },
            'fil': {
                // Landing Page
                'landing.title': 'AffiliateAI',
                'landing.subtitle': 'Ang iyong platform para sa automation ng benta.',
                'landing.login': 'Mag-login',
                'landing.start': 'Magsimula Nang Libre',
                'landing.dashboard': 'Pumunta sa Dashboard',
                'landing.features': 'Mga Feature',
                'landing.howItWorks': 'Paano Gumagana',
                'landing.pricing': 'Presyo',

                // Features
                'features.title': 'Lahat ng kailangan mo para palakasin ang iyong benta',
                'features.subtitle': 'Malakas na AI tools para i-automate ang iyong affiliate marketing',

                // Common
                'common.loading': 'Naglo-load...',
                'common.save': 'I-save',
                'common.cancel': 'Kanselahin',
                'common.delete': 'Tanggalin',
                'common.edit': 'I-edit',
            },
            'hi': {
                // Landing Page
                'landing.title': 'AffiliateAI',
                'landing.subtitle': 'आपका बिक्री स्वचालन मंच।',
                'landing.login': 'लॉगिन करें',
                'landing.start': 'मुफ्त में शुरू करें',
                'landing.dashboard': 'डैशबोर्ड पर जाएं',
                'landing.features': 'विशेषताएं',
                'landing.howItWorks': 'यह कैसे काम करता है',
                'landing.pricing': 'मूल्य निर्धारण',

                // Features
                'features.title': 'अपनी बिक्री बढ़ाने के लिए आवश्यक सब कुछ',
                'features.subtitle': 'अपने एफिलिएट मार्केटिंग को स्वचालित करने के लिए शक्तिशाली AI उपकरण',

                // Common
                'common.loading': 'लोड हो रहा है...',
                'common.save': 'सहेजें',
                'common.cancel': 'रद्द करें',
                'common.delete': 'हटाएं',
                'common.edit': 'संपादित करें',
            }
        }

export function getTranslation(locale: Locale, key: string): string {
        const localeTranslations = translations[locale] as Record<string, string>
    return localeTranslations[key] || key
}
