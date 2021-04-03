import api from '../../servicos/api';
import React,{useState,useEffect} from 'react';
import history from '../../history'
import './cadastroServiços.css'
import '../../app.css'

function CadastroServicos(){
    const [codCli,setCodCli]=useState('');
    const [carro,setCarro]=useState('');
    const [carros,setCarros]=useState([]);
    const [descricao,setDescricao]=useState('');
    const [dtInicio,setDtInicio]=useState('');
    const [maoObra,setMaoObra]=useState('');

    const [pecs,setPecs]=useState([]);
    const [quant,setQuant]=useState('');
    const [valorUni,setValorUni]=useState('');

    useEffect(()=>{
        setCodCli(localStorage.getItem('cod_cli'));
        listarCarros();
    },[]);
    async function listarCarros(){
        const response2 = await api.get(`/carroPes/${localStorage.getItem('cod_cli')}`).then((resp)=>{
            setCarros(resp.data);
        });
    }
    async function cadastrarServico(e){
        e.preventDefault();
        let mensagem = document.querySelector("#mensagem");
    }
    function voltar(){
        history.goBack();
    }
    return(
        <div id="tela" className="background">    
            <aside className="div-servico">
                <h1>Cadastrar Contato</h1>
                <form className='formularioServico' onSubmit={cadastrarServico}>
                    <div className="input-block block-data" >
                        <label htmlFor="dtInicio">Data de inicio: </label>
                        <input type="date" name="dtInicio" id="dtInicio" value={dtInicio} onChange={e=>setDtInicio(e.target.value)} required/>
                    </div>

                    <div className="input-block block-carro">
                        <label>Carro: </label>
                        <select className="select-carro" value={carro} onChange={e=>setCarro(e.target.value)}>
                                <option id="op-selecione" value="">
                                    Selecione uma opcao
                                </option>
                                {carros.map(car=>(
                                    <option key={car.car_id} value={car.car_id}>
                                        {car.car_placa} {car.car_modelo}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="input-block block-desc">
                        <label htmlFor="descricao">Descrição</label>
                        <input name="descricao" id="descricao" value={descricao} onChange={e=>setDescricao(e.target.value)} required/>
                    </div>

                    
                    <div className="cadastroPecas">
                        <h1>Adicionar peças Utilizadas</h1>
                        <div className="input-block block-quant">
                            <label htmlFor="quant">Quantidade:</label>
                            <input type="number" name="quant" id="quant" value={quant} onChange={e=>setQuant(e.target.value)} required/>
                        </div>

                        <div className="input-block block-valorUni">
                            <label htmlFor="valorUni">Valor Unitário:</label>
                            <input type="number" step="0.01" name="valorUni" id="valorUni" value={valorUni} onChange={e=>setValorUni(e.target.value)} required/>
                        </div>
                        <div id="mensagemContato">

                        </div>
                        <button type="button" className="btnFormPecas">Adicionar Peças</button>
                    </div>         
                    <div id="divTable">
                        <table id="tabelaCont">
                            <thead>
                                <tr>
                                    <td>Quant</td>
                                    <td>Valor Uni.</td>
                                    <td>Descrição</td>
                                </tr>
                            </thead>
                            <tbody>
                                {pecs.map(pec=>(
                                    <tr key={pec.pec_id}>
                                        <td>{pec.pec_valorUni}</td>
                                        <td>{pec.pec_desc}</td>
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div id="mensagem">

                    </div>
                            
                            
                    <button type="submit" id="btnForm">Salvar</button>
                </form>
                <button type="button" onClick={voltar}>Voltar</button>
            </aside>
        </div>
    );
}
export default CadastroServicos;