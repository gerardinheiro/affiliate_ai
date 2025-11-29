"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Locale, getTranslation } from '@/lib/i18n'

type LocaleContextType = {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: (key: string) => string
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('pt-BR')

    useEffect(() => {
        // Load locale from localStorage
        const savedLocale = localStorage.getItem('locale') as Locale
        if (savedLocale && (savedLocale === 'pt-BR' || savedLocale === 'en')) {
            setLocaleState(savedLocale)
        }
    }, [])

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale)
        localStorage.setItem('locale', newLocale)
    }

    const t = (key: string) => getTranslation(locale, key)

    return (
        <LocaleContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LocaleContext.Provider>
    )
}

export function useLocale() {
    const context = useContext(LocaleContext)
    if (!context) {
        throw new Error('useLocale must be used within LocaleProvider')
    }
    return context
}
