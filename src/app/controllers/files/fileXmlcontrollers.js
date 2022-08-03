import { store } from "../../..";
import { sds } from "../../../util/functionUtil";

export default async function fileXmlcontrollers(files, data) {
    files = [...files];
    var dados = [];
    for (let i = 0; i < files.length; i++) { var result = await readFileXml(files[i]); dados = [...dados, result]; }
    var updateData = data.nfe.map((n) => {
        var d = dados.find(p => p.chave === n.chave);
        if (d) {
            if (d.parcelas.length < 1) {
                n.parcelas = [{ numero: 1, valor: n.valor, vencimento: sds(n.data_emissao, 30) }]; n.formPag = d.formPag;
            } else { n.parcelas = d.parcelas; n.formPag = d.formPag; };
            n.vl_fcpst = d.vl_fcpst;
            n.vl_fcp = d.vl_fcp;
            n.vl_outras = d.vl_outro;
            n.vl_seguro = d.vl_seg;
            n.vl_frete = d.vl_frete;
            n.vl_icms_st = d.vl_st;
            n.vl_desconto = d.vl_desc;
        }
        return n;
    })
    data.nfe = updateData; return data;
};

function readFileXml(xml) {
    var dados = new FileReader();
    var res = new Promise((resolve, reject) => {
        dados.onerror = () => { dados.abort(); reject(new DOMException("Problem parsing input file.")); };
        dados.onload = (e) => {
            var parser = new DOMParser();
            var parcelas = [];
            var xmlDoc = parser.parseFromString(dados.result, "text/xml");
            var chave = xmlDoc.documentElement.querySelector('nfeProc > NFe > infNFe').getAttribute('Id').replace('NFe', '');
            var cobranca = xmlDoc.documentElement.querySelectorAll('nfeProc > NFe > infNFe > cobr > dup');
            var formaPagamento = xmlDoc.documentElement.querySelectorAll('nfeProc > NFe > infNFe > pag > detPag');
            var vl_fcpst = parseFloat(xmlDoc.documentElement.querySelector('nfeProc > NFe > infNFe > total > ICMSTot > vFCPST').textContent);
            var vl_fcp = parseFloat(xmlDoc.documentElement.querySelector('nfeProc > NFe > infNFe > total > ICMSTot > vFCP').textContent);
            var vl_st = parseFloat(xmlDoc.documentElement.querySelector('nfeProc > NFe > infNFe > total > ICMSTot > vST').textContent);
            var vl_ipi = parseFloat(xmlDoc.documentElement.querySelector('nfeProc > NFe > infNFe > total > ICMSTot > vIPI').textContent);
            var vl_outro = parseFloat(xmlDoc.documentElement.querySelector('nfeProc > NFe > infNFe > total > ICMSTot > vOutro').textContent);
            var vl_seg = parseFloat(xmlDoc.documentElement.querySelector('nfeProc > NFe > infNFe > total > ICMSTot > vSeg').textContent);
            var vl_frete = parseFloat(xmlDoc.documentElement.querySelector('nfeProc > NFe > infNFe > total > ICMSTot > vFrete').textContent);
            var vl_desc = parseFloat(xmlDoc.documentElement.querySelector('nfeProc > NFe > infNFe > total > ICMSTot > vDesc').textContent);
            var formPag = [];
            var nfe = { chave: chave }
            for (let index = 0; index < formaPagamento.length; index++) { formPag = [...formPag, { tipo: store.getState().dados.payment.find(t => t.cod === formaPagamento[index].querySelector('tPag').textContent), valor: parseFloat(formaPagamento[index].querySelector('vPag').textContent) }] }
            for (let index = 0; index < cobranca.length; index++) { parcelas = [...parcelas, { numero: parseInt(cobranca[index].querySelector('nDup').textContent), vencimento: cobranca[index].querySelector('dVenc').textContent.replace(/(\d{4}).(\d\d).(\d\d)/g, '$03/$02/$1'), valor: parseFloat(cobranca[index].querySelector('vDup').textContent.replace(',', '.')) }]; }
            nfe = { ...nfe, parcelas, formPag, vl_fcpst: vl_fcpst, vl_fcp: vl_fcp, vl_st: vl_st, vl_ipi: vl_ipi, vl_outro: vl_outro, vl_seg: vl_seg, vl_frete: vl_frete, vl_desc: vl_desc };
            resolve({ ...nfe });
        };
        dados.readAsText(xml);
    })
    return res;
}