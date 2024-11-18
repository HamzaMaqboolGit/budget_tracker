export const Currencies = [
    {
        value: "USD",
        label: "$ Dollar",
        locale: "en-US"
    },
    {
        value: "EUR",
        label: "€ EURO",
        locale: "de-DE"
    },
    {
        value: "GBP",
        label: "£ Pound",
        locale: "gb-GB"
    },
]
export type currency = (typeof Currencies)[0];