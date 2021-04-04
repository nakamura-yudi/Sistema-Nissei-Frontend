import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import "./home.css"
import Header from '../../Components/Header'
function Home()
{
   

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

    function cadastrarPeca(){
        history.push('/cadastroPeca');
    }

    return (
    <div className="background">
        <Header/>
        <div className="list">
            <button type="button" onClick={listarClientes} className="button-home">Listar Clientes</button>
            <button type="button" onClick={listarFuncionarios} className="button-home">Listar Funcionarios</button>
            <button type="button" onClick={cadastrarPeca} className="button-home">Cadastrar Peça</button>
            <button type="button" onClick={cadastrarFuncionario} className="button-home">Cadastrar Funcionário</button>
            <button type="button" onClick={cadastrarCliente} className="button-home">Cadastrar Clientes</button>
            
        </div>
    </div>
    );
}

export default Home;