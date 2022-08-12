import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAcumulador } from '..';
import fileSpedcontrollers from '../app/controllers/files/fileSpedcontrollers';
import fileXmlcontrollers from '../app/controllers/files/fileXmlcontrollers';
import generateFile from '../app/controllers/files/generateFile';
import AccordionNF from './AccordionNF';

export default function MergeSpedXml(props) {
    const [data, setData] = useState(null);
    const [acumulador, setAcumulador] = useState(null);
    const [fileSpedInputDisabled, setFileSpedInputDisabled] = useState(false);
    const [fileXMlInputDisabled, setFileXMlInputDisabled] = useState(true);
    const [buttonDisabled, setbuttonDisabled] = useState(true);
    const dispatch = useDispatch();

    const refInputSped = useRef();
    const refInputXmls = useRef();

    useEffect(() => {
        if (data) {
            //console.log('useEffect', data);

        }
    }, [data, fileSpedInputDisabled, fileXMlInputDisabled, buttonDisabled, acumulador])

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
        fileXmlcontrollers(refInputXmls.current.files, data).then(r => { setData(r); setFileXMlInputDisabled(true); });
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

    function changeInputCfop(e) {
        e.preventDefault();
        var acum = data.acumulador.find((d) => d.cfop === e.target.name.split('-')[0] && d.doc === e.target.name.split('-')[1]);
        var acum1 = data.acumulador;
        acum.acumulador = e.target.value;
        setAcumulador(acum1);
    }

    function gravaAcumulador(e) {
        e.preventDefault();
        dispatch(addAcumulador(acumulador));
        setbuttonDisabled(false);
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
                <>
                    <div className="container text-center">
                        <div className="row row-cols-6">
                            {data.acumulador.map((d, i) => {
                                return (
                                    <div key={i} className="col">
                                        <div className="row">
                                            <label htmlFor={`AC-${d.cfop}-${d.doc}`} className="col-sm col-form-label">{`${d.cfop}-${d.doc}`}</label>
                                            <div className="col-sm">
                                                <input type={'text'} maxLength={3} min={0} name={`${d.cfop}-${d.doc}`} className="form-control" onChange={changeInputCfop} id={`AC-${d.cfop}-${d.doc}`} value={undefined} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="col-12">
                                <button type="button" className="btn btn-primary" onClick={gravaAcumulador}>Gravar Acumulador</button>
                            </div>
                        </div>
                    </div>
                    <div className="accordion accordion-flush" id="accordionFlushExample">
                        {data.nfe.map((n, i) => <AccordionNF key={i} notafiscal={n} />)}
                    </div>
                </>
                : <></>}
        </div>
    </div>);
};