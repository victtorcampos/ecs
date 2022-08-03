import { addCidade, store } from "../../..";
import { stf } from "../../../util/functionUtil";

export default async function fileSpedcontrollers(file) {
    if (file.type === 'text/plain') {
        return await fileReader(file);
    }
};

async function fileReader(file) {
    var cadastro = {};
    var fornecedores = [];
    var produtos = [];
    var nfe = [];
    var result = await new Promise((resolve) => {
        var fileReader = new FileReader();
        fileReader.onload = async () => {
            var linha = fileReader.result.split('\n');
            for (let a = 0; a < linha.length; a++) {
                var campo = linha[a].split('|');
                if (campo[1] === '0000') { cadastro = reg0000(campo); }
                else if (campo[1] === '0150') { fornecedores = [...fornecedores, await reg0150(campo)]; }
                else if (campo[1] === '0200') { produtos = [...produtos, reg0200(campo)]; }
                else if (campo[1] === 'C100' && campo[2] === '0' && campo[3] === '1' && campo[9] !== '') {
                    // eslint-disable-next-line no-loop-func
                    nfe = [...nfe, regC100(linha, a, fornecedores.find(f => f.cod === campo[4]), produtos)]
                }
            }
            cadastro = { ...cadastro, fornecedores, produtos, nfe }
            resolve(cadastro);
        }
        fileReader.readAsText(file, 'ISO-8859-1');
    });

    return result;
}

function regC100(l, i, f, gp) {

    var campo = l[i].split('|');
    var item = [];
    var total = [];
    for (let a = (i + 1); l[a].split('|')[1] === 'C110' || l[a].split('|')[1] === 'C112' || l[a].split('|')[1] === 'C170' || l[a].split('|')[1] === 'C190' || l[a].split('|')[1] === 'C191' || l[a].split('|')[1] === 'C195'; a++) {
        if (l[a].split('|')[1] === 'C170') {
            item = [...item, regC170(l[a].split('|'), gp.find(p => p.cod === l[a].split('|')[3]))];
        } else if (l[a].split('|')[1] === 'C190') {
            total = [...total, regC190(l[a].split('|'))]
        }

    }
    return {
        numero: campo[8]
        , serie: campo[7]
        , chave: campo[9]
        , data_emissao: campo[10].toString().replace(/(\d\d)(\d\d)(\d{4})/g, '$1/$2/$3')
        , data_entrada: campo[11].toString().replace(/(\d\d)(\d\d)(\d{4})/g, '$1/$2/$3')
        , tipo_pagamento: (campo[11] === '0') ? 'A_VISTA' : (campo[11] === '1') ? 'A_PRAZO' : 'OUTROS'
        , valor: stf(campo[12])
        , vl_desconto: stf(campo[14])
        , vl_mercadoria: stf(campo[16])
        , tipo_frete: campo[17]
        , vl_frete: stf(campo[18])
        , vl_seguro: stf(campo[19]) | 0.00
        , vl_outras: stf(campo[20])
        , vl_bc_icms: stf(campo[21])
        , vl_icms: stf(campo[22])
        , vl_bc_icms_st: stf(campo[23])
        , vl_icms_st: stf(campo[24])
        , vl_IPI: stf(campo[25])
        , vl_PIS: stf(campo[26])
        , vl_COFINS: stf(campo[27])
        , vl_PIS_ST: stf(campo[28] | 0.00)
        , vl_COFINS_ST: stf(campo[29] | 0.00)
        , fornecedor: f
        , item
        , total
        , vl_fcpst: 0.00
        , vl_fcp: 0.00
        , parcelas: null
        , formPag: null
    }
}

function regC170(p, cp) {

    return {
        cod: p[3]
        , descricao: p[4]
        , ncm: cp.ncm
        , cest: cp.cest
        , qtd: stf(p[5])
        , unid: p[6]
        , vl_item: stf(p[7])
        , vl_desc: stf(p[8])
        , cst_icms: p[10]
        , cfop: p[11]
        , bc_icms: stf(p[13])
        , alqt_icms: stf(p[14])
        , vl_icms: stf(p[15])
        , bc_icms_st: stf(p[16])
        , alqt_icms_st: stf(p[17])
        , vl_icms_st: stf(p[18])
        , cst_ipi: p[20]
        , bc_ipi: stf(p[22] | 0.00)
        , alqt_ipi: stf(p[23] | 0.00)
        , vl_ipi: stf(p[24] | 0.00)
        , cst_pis: p[25]
        , bc_pis: stf(p[26])
        , alqt_pis: stf(p[27])
        , vl_pis: stf(p[30])
        , cst_cofins: p[31]
        , bc_cofins: stf(p[32])
        , alqt_cofins: stf(p[33])
        , vl_cofins: stf(p[36])
    }
}

function regC190(p) {
    return {
        cst: p[2]
        , cfop: p[3]
        , alqt: stf(p[4])
        , vl: stf(p[5])
        , bc_icms: stf(p[6])
        , red_bc_icms: stf(p[10])
        , vl_icms: stf(p[7])
        , bc_icms_st: stf(p[8])
        , vl_icms_st: stf(p[9])
        , vl_ipi: stf(p[11])
        , cod_obs: p[12]
    }
}

function reg0200(p) {
    return { cod: p[2], nome: p[3], codBarros: p[4], unidade: p[6], tipo: p[7], ncm: p[8], gen: p[10], aliqIcms: p[12], cest: p[13] }
}



async function reg0150(p) {
    return new Promise(async (resolve) => {
        var cidade = store.getState().dados.cidades.find(cidade => cidade.id === p[8]);
        if (cidade === undefined) {


            var res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${p[8]}`, { "method": "GET" }).then(j => j.json());
            console.log(res);
            cidade = { id: res.id, nome: res.nome, estado: { sigla: res.microrregiao.mesorregiao.UF.sigla, nome: res.microrregiao.mesorregiao.UF.nome } };
            store.dispatch(addCidade(cidade));
        }
        resolve({ cod: p[2], nome: p[3].toUpperCase(), tipo_doc: p[5] ? 'CNPJ' : 'CPF', doc: `${p[5]}${p[6]}`, ie: p[7] ? p[7] : 'ISENTO', cidade: cidade, endereco: p[10], endereco_numero: p[11], endereco_compl: p[12], endereco_bairro: p[13] })
    });

};
function reg0000(p) {
    return {
        periodo: p[4]
        , nome: p[6].toUpperCase(), doc: p[8] === '' ? p[7] : p[8], tipoDoc: p[8] === '' ? 'CNPJ' : 'CPF', ie: p[10]
    };
};