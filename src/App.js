import React from 'react'
import history from './history'
import { Route,Router,Switch } from 'react-router-dom'

import Login from './Paginas/Login/login'
import Home from './Paginas/Home/home'
import ListaClientes from './Paginas/Listas/listaClientes'
import ListaFuncionarios from './Paginas/Listas/listarFuncionario'
import CadastroCliente from './Paginas/Cadastros/cadastroCliente'
import CadastroCarro from './Paginas/Cadastros/cadastroCarro'
import CadastroPeca from './Paginas/Cadastros/cadastroPeca'
import CadastroFuncionario from './Paginas/Cadastros/cadastroFuncionario'
import InfoCliente from './Paginas/ClienteInfo/infoCliente'
import CadastroContato from './Paginas/Cadastros/cadastroContato'
function App() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact={true} component={Login}/>
        <Route path="/home" exact={true} component={Home}/>
        <Route path="/listaClientes" exact={true} component={ListaClientes}/>
        <Route path="/listaFuncionarios" exact={true} component={ListaFuncionarios}/>
        <Route path="/cadastroCliente" exact={true} component={CadastroCliente}/>
        <Route path="/cadastroCarro" exact={true} component={CadastroCarro}/>
        <Route path="/cadastroPeca" exact={true} component={CadastroPeca}/>
        <Route path="/cadastroFuncionario" exact={true} component={CadastroFuncionario}/>
        <Route path="/cadastroContato" exact={true} component={CadastroContato}/>
        <Route path="/infoCliente" exact={true} component={InfoCliente}/>
      </Switch>
    </Router>
  );
}

export default App;
