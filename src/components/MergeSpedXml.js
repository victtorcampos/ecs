import React, { useEffect, useRef, useState } from 'react';

import fileSpedcontrollers from '../app/controllers/files/fileSpedcontrollers';
import fileXmlcontrollers from '../app/controllers/files/fileXmlcontrollers';
import generateFile from '../app/controllers/files/generateFile';
import { ftss2, ftss6 } from '../util/functionUtil';

export default function MergeSpedXml(props) {
    const [data, setData] = useState(null);
    const [fileSpedInputDisabled, setFileSpedInputDisabled] = useState(false);
    const [fileXMlInputDisabled, setFileXMlInputDisabled] = useState(true);
    const [buttonDisabled, setbuttonDisabled] = useState(true);

    const refInputSped = useRef();
    const refInputXmls = useRef();

    useEffect(() => { if (data) { console.log('useEffect', data); } }, [data, fileSpedInputDisabled, fileXMlInputDisabled, buttonDisabled])

    function HandlerSubmit(e) {
        e.preventDefault()
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + generateFile(data));
        element.setAttribute('download', `${data.doc}-${data.periodo}.txt`);
        document.body.appendChild(element);
        element.click();
    }

    function changeInputFileSped(e) {
        e.preventDefault();
        setFileSpedInputDisabled(true);
        fileSpedcontrollers(refInputSped.current.files[0]).then(r => { setData(r); setFileXMlInputDisabled(false); });
    }
    function changeInputFileXmls(e) {
        e.preventDefault();
        fileXmlcontrollers(refInputXmls.current.files, data).then(r => { setData(r); setFileXMlInputDisabled(true); setbuttonDisabled(false); });
    }

    function changeGerarTxtChave(e) {
        e.preventDefault();
        var chaves = '';
        for (let i = 0; i < data.nfe.length; i++) { chaves = chaves + `${data.nfe[i].chave}\n`; }
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(chaves));
        element.setAttribute('download', 'chavesnfe.txt');
        document.body.appendChild(element);
        element.click();
    }

    return (<div>
        <div> <form onSubmit={HandlerSubmit}>
            <div>
                <label htmlFor="inputFileSped">Escolha um arquivo SPED:</label>
                <input type={'file'} disabled={fileSpedInputDisabled ? "disabled" : ""} ref={refInputSped} onChange={changeInputFileSped} id="inputFileSped" name="fileSped" value={undefined} accept=".txt, text/plain" />
            </div>
            < div >
                <label htmlFor="inputFileXml">Escolha o(s) arquivo(s) XML:</label>
                <input type={'file'} disabled={fileXMlInputDisabled ? "disabled" : ""} ref={refInputXmls} onChange={changeInputFileXmls} id="inputFileXml" name="fileXml" value={undefined} multiple accept=".xml" />
            </div>
            <div>
                <button onClick={changeGerarTxtChave} disabled={fileXMlInputDisabled ? "disabled" : ""}>Gerar TXT com a chave</button>
            </div>
            <div>
                <button type='submit' disabled={buttonDisabled ? "disabled" : ""}>Gerar Arquivo</button>
            </div>
        </form>
        </div>
        <div className='container'>
            {data !== null ?
                <table className="table">
                    <thead> </thead>
                    <tbody> {data.nfe.map((n, i) => <NotaRow key={i} index={i + 1} notafiscal={n} />)} </tbody>
                </table> : <></>}
        </div>
    </div>);
};

function NotaRow(props) { return (<><TdNotaFiscal nota={props} /><TdItem nota={props} /></>) }

function TdItem(props) {
    const item = props.nota.notafiscal.item;
    return (<>
        {item.map((produto, i) => <tr style={isTributavel(produto.cfop)} key={`${produto.cod}${i}`}>
            <td>{produto.cod}</td>
            <td colSpan={2}>{produto.descricao}</td>
            <td>{produto.ncm}</td>
            <td>{produto.cest}</td>
            <td>{produto.cfop}</td>
            <td>{produto.vl_icms > 0.00 ? `${ftss2(produto.bc_icms)}x${ftss2(produto.alqt_icms)}=${ftss2(produto.vl_icms)}` : ''}</td>
            <td>{produto.unid}</td>
            <td>{ftss2(produto.qtd)}</td>
            <td>{ftss6(produto.vl_item / produto.qtd)}</td>
            <td>{ftss2(produto.vl_item)}</td>
        </tr>)}
    </>);
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

function TdNotaFiscal(props) {
    const { numero, serie, chave, valor, data_emissao, data_entrada, parcelas, formPag } = props.nota.notafiscal;

    return <tr style={{ backgroundColor: "black", color: 'white' }}>
        <td>{numero}</td>
        <td>{serie}</td>
        <td>{chave}</td>
        <td>{ftss2(valor)}</td>
        <td colSpan={3}>{`${data_emissao} - ${data_entrada}`}</td>
        {parcelas !== null ? <Parcela parcelas={parcelas} /> : <td></td>}
        {formPag !== null ? <FormaPag formpag={formPag} /> : <td></td>}
    </tr>;
}

function Parcela(props) {
    var parc = <></>;
    for (let index = 0; index < props.parcelas.length; index++) {
        parc = <>{parc}<p style={{ marginTop: '0px', marginBottom: '0px', fontSize: '10px' }}>{`${props.parcelas[index].vencimento} = ${ftss2(props.parcelas[index].valor)}`}</p></>
    }
    return <td>{parc}</td>
}

function FormaPag(props) {
    var pag = <></>;
    for (let index = 0; index < props.formpag.length; index++) {
        pag = <>{pag}<p>{`${props.formpag[index].tipo.descr} = ${ftss2(props.formpag[index].valor)}`}</p></>
    }

    return <td>{pag}</td>;
}