import {useLocation} from "react-router-dom"
import history from '../history'
import React, {useState} from 'react';
import './Header.css'
function Header(){
    function voltarTela(){
        localStorage.removeItem('cod_cli');
        localStorage.removeItem('cod_func');
        history.push('/home');
    }
    function logout(){
        localStorage.clear()
        history.push('/');
    }
    return(
    <header className='header'>
        <button type="button" className='button-inicio' onClick={voltarTela}>Nissei</button>
        <div className="divHeader">
        <button type="button" onClick={logout} class="button-logout">Sair</button>
            
        </div>
    </header>
    );
}
export default Header;