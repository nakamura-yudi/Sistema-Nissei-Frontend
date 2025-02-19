import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import './cadastroCarro.css'
import Header from '../../Components/Header'
function FormularioCarro()
{
    const [marca,setMarca] = useState('');
    const [marcas,setMarcas] = useState([]);
    const [placa,setPlaca] = useState('');
    const [ano,setAno] = useState(0);
    const [modelo,setModelo] = useState('');
    const [km,setKm]= useState(0);

    const [button,setButton] = useState("Salvar");
    const [titulo,setTitulo] = useState('Cadastrar Carro');
    const [loading,setLoading]=useState(false);
    useEffect(()=>{
        if(localStorage.getItem('car_id')!=null)
        {
            alterarCarro();
        }
        listarMarcas();
        
    },[]);

function voltar(){
    if(localStorage.getItem('car_id'))
        localStorage.removeItem('car_id');
    history.goBack();
}

    async function alterarCarro(){
        setTitulo("Alterar Carro");
        setButton("Alterar");

        const response = await api.get(`/carro/${localStorage.getItem('car_id')}`);
        setModelo(response.data[0].car_modelo);
        setPlaca(response.data[0].car_placa);
        setAno(response.data[0].car_ano);
        setKm(response.data[0].car_km);
        setMarca(response.data[0].mar_cod);
    }
    async function listarMarcas(){
 
        const response = await api.get(`/marcas`).then((response)=>{
            setMarcas(response.data);
        })

    }
    function vazio(valor)
    {
        let v=''+valor;
        if(v.length===0)
        return true;
        return false;
    }
    function negativo(valor){
        if(valor<0)
            return true;
        return false;
    }
    function validarPlaca(valor){
        var reg=/^[A-Z]{3}\d{1}[A-Z]{1}\d{2}$/;
        if(valor.match(reg)!==null)
            return true;
        return false;
    }
    function ValidarCamposCarro(){
        var test = true;
        let mensagem = document.querySelector("#mensagem");
        mensagem.innerHTML="";
        if(vazio(marca)){
            mensagem.innerHTML+="<p>Marca não foi selecionada</p>"
            test=false;
        }
        var now=new Date();
        if(ano<=0 || ano>now.getFullYear()){
            mensagem.innerHTML+="<p>Ano inválido</p>"
            test=false;
        }
        if(negativo(km)){
            mensagem.innerHTML+="<p>Km inválido</p>"
            test=false;
        }
        if(!validarPlaca(placa)){
            mensagem.innerHTML+="<p>Placa inválida</p>"
            test=false;
        }
        
        return test;
    }
    async function adicionarCarro(e){
        setLoading(true);
        e.preventDefault();
        
        if(ValidarCamposCarro()){
            
            if(button==='Salvar'){
                const response=await api.post('/carro',{
                    pes_cod: localStorage.getItem('cod_cli'),
                    mar_cod: marca,
                    car_placa: placa,
                    car_ano: ano,
                    car_modelo: modelo,
                    car_km: km
                })
                alert('Carro Cadastrado');
            }
            else
            {
                const response=await api.put('/carro',{
                    car_id: localStorage.getItem('car_id'),
                    pes_cod: localStorage.getItem('cod_cli'),
                    mar_cod: marca,
                    car_placa: placa,
                    car_ano: ano,
                    car_modelo: modelo,
                    car_km: km
                })
                alert('Carro Alterado');
                localStorage.removeItem('car_id');
                history.goBack();
            }
            
            setPlaca('');
            setAno(0);
            setModelo('');
            setMarca('');
            setKm(0);
        }
        setLoading(false);

    }
    return (
    <div className="background">
        <Header/>
        <div className='div-carro'>
            <h1 id="titulo">{titulo}</h1>
            <form className='form-carro' onSubmit={adicionarCarro} >
                <div className="block-placa" id="block-placa">
                    <label htmlFor="placa">Placa: </label>
                    <input name="placa" id="placa" value={placa} onChange={e=>setPlaca(e.target.value)} required/>
                </div>
                <div className="block-ano" id="block-ano">
                    <label htmlFor="ano">Ano: </label>
                    <input type="number" name="ano" id="ano" value={ano} onChange={e=>setAno(e.target.value)} required/>
                </div>
                <div className="block-modelo" id="block-modelo">
                    <label htmlFor="modelo">Modelo: </label>
                    <input type="text" name="modelo" id="modelo" value={modelo} onChange={e=>setModelo(e.target.value)} required/>
                </div>
                <div className="block-km" id="block-km">
                    <label htmlFor="km">Km: </label>
                    <input type="number" name="km" id="km" value={km} onChange={e=>setKm(e.target.value)} required/>
                </div>
                <div className="block-marca" id="block-marca">
                    <label>Marca: </label>
                    <select id="select-marca" value={marca} onChange={e=>setMarca(e.target.value)}>
                            <option id="op-selecione" value="">
                                Selecione uma opcao
                            </option>
                            {marcas.map(mar=>(
                                <option key={mar.mar_cod} value={mar.mar_cod} >
                                    {mar.mar_descricao}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="mensagem" id="mensagem">

                </div>
                <button type="submit" className='button-carro' id="btnForm">{button}</button>
            </form>
            <button type="button" className='button-carro' onClick={voltar}>Voltar</button>
        </div>
        {loading &&
            <div className="modalCar">
                
                <ReactLoading type={"spinningBubbles"} color={"#ffffff"} height={'20%'} width={'20%'} />
            </div>
        }
    </div>
    );
}

export default FormularioCarro;