import React, { useEffect, useState } from 'react';
import { ftss2 } from '../util/functionUtil';

function AccordionNF(props) {
    const [showAccordion, setShowAccordion] = useState(false);
    useEffect(() => { }, []);
    return (<>
        <div className="accordion-item">
            <h2 className="accordion-header" id="flush-headingOne">
                <button className={`accordion-button ${showAccordion ? `` : `collapsed`}`} onClick={() => setShowAccordion(!showAccordion)} type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded={showAccordion} aria-controls="flush-collapseOne">
                    <Cabecalho nf={props.notafiscal} />
                </button>
            </h2>
            <div id="flush-collapseOne" className={`accordion-collapse collapse ${showAccordion ? `show` : ``}`} aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                <div className="accordion-body" style={{ backgroundColor: "#f1f1f1" }}><table className="table caption-top" style={{ backgroundColor: 'white' }}>
                    <caption>Produto(s)</caption>
                    <thead>
                        <tr>
                            <th scope="col">CÓDIGO</th>
                            <th scope="col">DESCRIÇÃO</th>
                            <th scope="col">UN</th>
                            <th scope="col">NCM</th>
                            <th scope="col">CFOP</th>
                            <th scope="col">CST</th>
                            <th scope="col">DESCONTO</th>
                            <th scope="col">ICMS</th>
                            <th scope="col">ICMS-ST</th>
                            <th scope="col">IPI</th>
                            <th scope="col">VALOR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.notafiscal.item.map((v, i) => <tr key={i} style={isTributavel(v.cfop)}>
                            <td>{v.cod}</td>
                            <td>{v.descricao}</td>
                            <td>{v.unid}</td>
                            <td>{v.ncm}</td>
                            <td>{v.cfop}</td>
                            <td>{v.cst_icms}</td>
                            <td>{v.vl_desc > 0 ? ftss2(v.vl_desc) : ''}</td>
                            <td>{v.vl_icms > 0 ? ftss2(v.vl_icms) : ''}</td>
                            <td>{v.vl_icms_st > 0 ? ftss2(v.vl_icms_st) : ''}</td>
                            <td>{v.vl_ipi > 0 ? ftss2(v.vl_ipi) : ''}</td>
                            <td>{ftss2(v.vl_item)}</td>
                        </tr>)}
                    </tbody>
                </table>{props.notafiscal.parcelas ? <table className="table caption-top" style={{ width: "300px", backgroundColor: 'white' }}>
                    <caption>Parcela(s)</caption>
                    <thead>
                        <tr>
                            <th scope="col">DATA</th>
                            <th scope="col">VALOR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.notafiscal.parcelas.map((v, i) => <tr key={i}>
                            <td>{v.vencimento}</td>
                            <td>{ftss2(v.valor)}</td>
                        </tr>)}
                    </tbody>
                </table> : <></>}</div>
            </div>
        </div>
    </>)
}

function Cabecalho(props) {

    return <div style={{ fontSize: "12px" }}>
        <b>Nº</b> {props.nf.numero}, <b>Serie</b> {props.nf.serie}, <b>Valor</b> {ftss2(props.nf.valor)}, <b>Chave</b> {props.nf.chave}{`, `}
        {props.nf.vl_icms_st > 0 ? <>{` `}<b>Icms ST</b> {ftss2(props.nf.vl_icms_st)},</> : ``}
        {props.nf.vl_fcpst > 0 ? <>{` `}<b>FCP ST</b> {ftss2(props.nf.vl_fcpst)},</> : ``}
        {props.nf.vl_ipi > 0 ? <>{` `}<b>IPI</b> {ftss2(props.nf.vl_ipi)},</> : ``}
        {props.nf.vl_outras > 0 ? <>{` `}<b>Desp Acess</b> {ftss2(props.nf.vl_outras)},</> : ``}
        {props.nf.vl_frete > 0 ? <>{` `}<b>Frete</b> {ftss2(props.nf.vl_frete)},</> : ``}
        {props.nf.vl_seguro > 0 ? <>{` `}<b>Seguro</b> {ftss2(props.nf.vl_seguro)},</> : ``}
        {` `}<b>Emissão/Entrada</b> {props.nf.data_emissao}-{props.nf.data_entrada},
    </div>
}

function isTributavel(cfop) {
    if (cfop === '1403' || cfop === '2403') { return { fontSize: '12px', backgroundColor: '#f443364d' } }
    else if (cfop === '1102' || cfop === '2102') { return { fontSize: '12px', backgroundColor: '#00ffff33' } }
    else if (cfop === '1117' || cfop === '2117') { return { fontSize: '12px', backgroundColor: '#673ab780' } }
    else if (cfop === '1407' || cfop === '2407') { return { fontSize: '12px', backgroundColor: '#607d8b7d' } }
    else if (cfop === '1551' || cfop === '2551') { return { fontSize: '12px', backgroundColor: '#9c27b087' } }
    else if (cfop === '1556' || cfop === '2556') { return { fontSize: '12px', backgroundColor: '#fffe0033' } }
    else if (cfop === '1653' || cfop === '2653') { return { fontSize: '12px', backgroundColor: '#7955489c' } }
    else if (cfop === '1910' || cfop === '2910') { return { fontSize: '12px', backgroundColor: '#0025ff5c' } }
    else if (cfop === '1922' || cfop === '2922') { return { fontSize: '12px', backgroundColor: '#00969885' } }
    else if (cfop === '1949' || cfop === '2949') { return { fontSize: '12px', backgroundColor: '#00ff265c' } }
    return { fontSize: '12px' }
}

export default AccordionNF;