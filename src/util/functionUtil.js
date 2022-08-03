import moment from "moment";

export function stf(v) { v = v + ""; return parseFloat(v.replace(',', '.')); };
export function ftss2(v) {
    return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace('.', '');
}
export function ftss6(v) { return v.toLocaleString('pt-BR', { minimumFractionDigits: 6, maximumFractionDigits: 6 }).replace('.', ''); }
export function cfopTributado(cfop) { if (cfop === '1403' || cfop === '2403') { return true; } return false; }
export function sds(d, q) { if (q > 30) { q = 30; }; var date = moment(d, "DD/MM/YYYY"); return date.add(q, 'days').format("DD/MM/YYYY"); }