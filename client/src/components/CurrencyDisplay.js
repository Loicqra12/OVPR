import React from 'react';
import { useTranslation } from 'react-i18next';

const currencyFormats = {
    fr: { currency: 'EUR', locale: 'fr-FR' },
    en: { currency: 'USD', locale: 'en-US' },
    es: { currency: 'EUR', locale: 'es-ES' },
    pt: { currency: 'EUR', locale: 'pt-PT' }
};

function CurrencyDisplay({ amount, className }) {
    const { i18n } = useTranslation();
    const format = currencyFormats[i18n.language] || currencyFormats.fr;

    const formattedAmount = new Intl.NumberFormat(format.locale, {
        style: 'currency',
        currency: format.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);

    return (
        <span className={className}>
            {formattedAmount}
        </span>
    );
}

export default CurrencyDisplay;
