import React, { useEffect, useRef, useState } from 'react';

import fileSpedcontrollers from '../app/controllers/files/fileSpedcontrollers';
import fileXmlcontrollers from '../app/controllers/files/fileXmlcontrollers';
import generateFile from '../app/controllers/files/generateFile';
import AccordionNF from './AccordionNF';

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
                <>
                    <div className="accordion accordion-flush" id="accordionFlushExample">
                        {data.nfe.map((n, i) => <AccordionNF key={i} notafiscal={n} />)}
                    </div>
                </>
                : <></>}
        </div>
    </div>);
};