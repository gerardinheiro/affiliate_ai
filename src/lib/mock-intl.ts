// Mock implementation of useTranslations to replace next-intl
// Returns translation keys as-is until proper i18n solution is implemented

export function useTranslations(namespace?: string) {
    return (key: string, params?: Record<string, any>) => {
        // Return the key itself as the translation
        // This allows the app to work without breaking, showing keys instead of translated text
        // If params are provided, we could interpolate them, but for now just return the key
        if (params) {
            // Simple interpolation: replace {key} with params[key]
            let result = key;
            Object.keys(params).forEach(paramKey => {
                result = result.replace(`{${paramKey}}`, String(params[paramKey]));
            });
            return result;
        }
        return key;
    };
}

export function useLocale() {
    return 'pt';
}

export async function getLocale() {
    return 'pt';
}

export async function getMessages() {
    return {};
}
