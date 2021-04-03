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
    
    return(
    <header className='header'>
        <button type="button" className='button-inicio' onClick={voltarTela}>Nissei</button>
        <div className="divHeader">
           
            
        </div>
    </header>
    );
}
export default Header;