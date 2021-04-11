import React, { useEffect, useState } from 'react';
import history from '../../history'
import "./home.css"
import api from '../../servicos/api';
import Header from '../../Components/Header'
function Home()
{
    const [isOpen,setIsOpen] = useState(false);
    useEffect(()=>{
      getStatus();
    },[]);
    async function getStatus(){
        const response = await api.get(`/pessoaEmail/${localStorage.getItem('user')}`).then((response)=>{
            if(response.data[0].fun_nivel=='A')
                setIsOpen(true);
        })

    }
    function cadastrarCliente(){
        history.push('/cadastroCliente');
    }

    function cadastrarFuncionario(){
        history.push('/cadastroFuncionario');
    }

    function listarClientes(){
        history.push('/listaClientes');
    }

    function listarFuncionarios(){
        history.push('/listaFuncionarios');
    }

    function cadastrarMarca(){
        history.push('/cadastroMarca');
    }
    function cadastrarPeca(){
        history.push('/cadastroPeca');
    }
    return (
    <div className="background">
        <Header/>
        <div className="list">
            <button type="button" onClick={listarClientes} className="button-home">Listar Clientes</button>
            <button type="button" onClick={listarFuncionarios} className="button-home">Listar Funcionarios</button>
            <button type="button" onClick={cadastrarMarca} className="button-home">Marcas de carro</button>
            <button type="button" onClick={cadastrarPeca} className="button-home">Peças</button>
            {isOpen &&
                <button type="button" onClick={cadastrarFuncionario} className="button-home">Cadastrar Funcionário</button>
            }
            <button type="button" onClick={cadastrarCliente} className="button-home">Cadastrar Clientes</button>
            
        </div>
    </div>
    );
}

export default Home;