const numberFormat = ({ value, decimal = 2 }) => (
    new Intl.NumberFormat(`${window.Locale}-CA`, {
        style: 'decimal',
        minimumFractionDigits: decimal,
        maximumFractionDigits: decimal,
    }).format(value)
);

export default numberFormat;
