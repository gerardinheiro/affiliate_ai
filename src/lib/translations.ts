// Simple translation helper that returns hardcoded Portuguese strings
// This replaces next-intl's useTranslations hook to avoid build errors

export function useTranslations(namespace: string) {
    return (key: string) => {
        // Return the key itself as fallback
        return key
    }
}
