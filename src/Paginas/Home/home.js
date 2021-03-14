import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
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
    <div>
        <button type="button" onClick={listarClientes}>Listar Clientes</button>
        <button type="button" onClick={listarFuncionarios}>Listar Funcionarios</button>
        <button type="button" onClick={cadastrarPeca}>CadastrarPeca</button>
        <button type="button" onClick={cadastrarFuncionario}>Cadastrar Funcionário</button>
        <button type="button" onClick={cadastrarCliente}>Cadastrar Clientes</button>
        <button type="button" onClick={logout}>Sair</button>
    </div>
    );
}

export default Home;