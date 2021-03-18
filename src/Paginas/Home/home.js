import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import "./home.css"

function Home()
{
    function logout(){
        localStorage.clear()
        history.push('/');
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

    function cadastrarPeca(){
        history.push('/cadastroPeca');
    }

    return (
    <div class="background">
        <div class="list">
            <button type="button" onClick={listarClientes} class="button">Listar Clientes</button>
            <button type="button" onClick={listarFuncionarios} class="button">Listar Funcionarios</button>
            <button type="button" onClick={cadastrarPeca} class="button">Cadastrar Peça</button>
            <button type="button" onClick={cadastrarFuncionario} class="button">Cadastrar Funcionário</button>
            <button type="button" onClick={cadastrarCliente} class="button">Cadastrar Clientes</button>
            <button type="button" onClick={logout} class="button">Sair</button>
        </div>
    </div>
    );
}

export default Home;