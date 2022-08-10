import { ftss2 } from "../../../util/functionUtil";

export default function generateFile(dados) {
    var text = `|00000|${dados.doc}|\n`;
    var fornecedores = dados.fornecedores;
    var estoque = dados.produtos;

    for (let f = 0; f < fornecedores.length; f++) { text = text + `|0020|${fornecedores[f].doc}|${fornecedores[f].nome}|${fornecedores[f].nome}|${fornecedores[f].endereco}|${fornecedores[f].endereco_numero}|${fornecedores[f].endereco_compl}|${fornecedores[f].endereco_bairro}|${fornecedores[f].cidade.id}|${fornecedores[f].cidade.estado.sigla}|||${fornecedores[f].ie}||||||||||N|||${sie(fornecedores[f].ie)}|||||||\n`; }
    text = text + `|0160|1|GERAL|\n`;
    for (let p = 0; p < estoque.length; p++) { text = text + `|0100|${estoque[p].cod}|${estoque[p].nome}||${estoque[p].ncm}||${estoque[p].codBarros}||1|${estoque[p].unidade}|S|O|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||${estoque[p].cest}|||\n`; }
    text = text + gni(dados.nfe);
    return text + '\n'
};

function gni(d) {
    var text = ''
    for (let a = 0; a < d.length; a++) {
        if (d[a].chave === '51220633009911002697550200007510931634900970') {
            console.log(d[a]);
        }
        var cfops = [...new Set(d[a].total.reduce((previousValue, currentValue) => { return [...previousValue, currentValue.cfop]; }, ''))].sort((a, b) => b - a);
        for (let b = 0; b < cfops.length; b++) {

            // eslint-disable-next-line no-loop-func
            var cfopimpostos = d[a].total.filter((f) => f.cfop === cfops[b]);
            var { vl } = cfopimpostos.reduce((p, c) => { p.vl = p.vl + c.vl; return p; }, { vl: 0 });
            var vlper = (vl / d[a].valor);
            var especie = d[a].serie !== '890' ? '36' : '105';
            var vl_frete = (d[a].vl_frete > 0 ? d[a].vl_frete * vlper : 0);
            var vl_seguro = (d[a].vl_seguro > 0 ? d[a].vl_seguro * vlper : 0);
            var vl_icms_st = (cfops[0] === '1403' ? d[a].vl_icms_st : 0)
            var vl_outras = (d[a].vl_outras > 0 ? d[a].vl_outras * vlper : 0);
            var vl_ipi = (d[a].vl_ipi > 0 ? d[a].vl_ipi * vlper : 0);
            // eslint-disable-next-line no-loop-func
            var itens = d[a].item.filter((i) => i.cfop === cfops[b]);
            var vl_produto = itens.reduce((p, c) => { p = p + c.vl_item; return p; }, 0)
            text = text + grnf('1000', 94, { '2': especie, '3': d[a].fornecedor.doc, '5': slac(cfops[b], d[a].fornecedor.doc), '6': cfops[b], '7': (cfops.length > 1 ? b + 1 : 0).toString(), '8': d[a].numero, '9': d[a].serie, '11': d[a].data_entrada, '12': d[a].data_emissao, '13': ftss2(vl), '16': 'C', '17': 'T', '26': ftss2(vl_frete), '27': ftss2(vl_seguro), '28': ftss2(vl_outras), '39': ftss2(vl_produto), '44': d[a].fornecedor.ie, '54': d[a].chave, '57': cfops[b], '90': ftss2(vl_ipi), '91': ftss2(vl_icms_st) });
            for (let c = 0; c < cfopimpostos.length; c++) {
                text = text + grnf('1020', 15, { '2': '1', '3': ftss2(0), '4': ftss2(cfopimpostos[c].bc_icms), '5': ftss2(cfopimpostos[c].alqt), '6': ftss2(cfopimpostos[c].vl_icms), '9': ftss2(cfopimpostos[c].vl_ipi), '10': ftss2(cfopimpostos[c].vl_icms_st), '11': ftss2(cfopimpostos[c].vl) })
                if (slac(cfops[b], d[a].fornecedor.doc) === '33') {
                    text = text + grnf('1020', 15, { '2': '28', '3': ftss2(0), '4': ftss2(cfopimpostos[c].vl), '5': ftss2(1.5), '6': ftss2((cfopimpostos[c].vl * 1.5) / 100), '9': ftss2(cfopimpostos[c].vl_ipi), '10': ftss2(cfopimpostos[c].vl_icms_st), '11': ftss2(cfopimpostos[c].vl), "12": "2607" })
                }
            }
            for (let d = 0; d < itens.length; d++) { text = text + grnf('1030', 96, { '2': itens[d].cod, '3': ftss2(itens[d].qtd), '4': ftss2(itens[d].vl_item), '5': ftss2(itens[d].vl_ipi), '6': ftss2(0), '7': '1', '11': ftss2(itens[d].vl_item), '12': ftss2(itens[d].vl_desc), '13': ftss2(itens[d].bc_icms), '15': ftss2(itens[d].alqt_icms), '22': ftss2(itens[d].vl_icms), '23': ftss2(itens[d].vl_icms_st), '27': ftss2(itens[d].vl_item / itens[d].qtd), '28': ftss2(itens[d].alqt_icms_st), '34': itens[d].cfop, '56': 'S', '57': itens[d].unid, '60': ftss2(itens[d].vl_item), '91': itens[d].cest, '95': itens[d].cod }); }
            if ((b + 1) === cfops.length) {
                var parcelas = d[a].parcelas;
                if (parcelas) {
                    for (let e = 0; e < parcelas.length; e++) {
                        text = text + grnf('1500', 14, { '2': parcelas[e].vencimento, '3': ftss2(parcelas[e].valor) });
                    };
                } else {
                    console.log(parcelas);
                }
            }
        }
    }
    return text;
}

function grnf(reg, qtreg, data) {
    var result = `|${reg}`;
    for (let i = 1; i <= qtreg; i++) { if (data[i.toString()]) { result = result + data[i.toString()] + '|' } else { result = result + '|' } };
    return result + '\n';
};

function slac(cfop, doc) {
    if (cfop === '1556' || cfop === '2556') { return '10'; }
    else if (cfop === '1403' || cfop === '2403') { if (doc.toString().length === 11) { return '33'; } return '4'; }
    else if (cfop === '1102' || cfop === '2102') { if (doc.toString().length === 11) { return '33'; } return '4'; }
    else if (cfop === '1117' || cfop === '2117') { return '48'; }
    else if (cfop === '1407' || cfop === '2407') { return '10'; }
    else if (cfop === '1551' || cfop === '2551') { return '31'; }
    else if (cfop === '1653' || cfop === '2653') { return '24'; }
    else if (cfop === '1910' || cfop === '2910') { return '26'; }
    else if (cfop === '1922' || cfop === '2922') { return '49'; }
    else if (cfop === '1949' || cfop === '2949') { return '27'; }
    return `SEMACUMULADOR-${cfop}`
};

function sie(ie) { if (ie) { return "S"; } else { return "N"; } };