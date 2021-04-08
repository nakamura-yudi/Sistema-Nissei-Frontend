import React from 'react';
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

    function cadastrarMarca(){
        history.push('/cadastroMarca');
    }

    return (
    <div className="background">
        <Header/>
        <div className="list">
            <button type="button" onClick={listarClientes} className="button-home">Listar Clientes</button>
            <button type="button" onClick={listarFuncionarios} className="button-home">Listar Funcionarios</button>
            <button type="button" onClick={cadastrarMarca} className="button-home">Cadastrar Marca</button>
            <button type="button" onClick={cadastrarFuncionario} className="button-home">Cadastrar Funcionário</button>
            <button type="button" onClick={cadastrarCliente} className="button-home">Cadastrar Clientes</button>
            
        </div>
    </div>
    );
}

export default Home;