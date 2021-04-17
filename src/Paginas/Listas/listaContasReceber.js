import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import './listarContasReceber.css'
import Header from '../../Components/Header'

function ListarContasReceber()
{
    function voltarHome(){
        localStorage.removeItem('cod_ser');
        history.goBack();
    }
    return (
        <div id="tela" className="background">
        <Header/>
        
        
        <div className="table-contasReceber">   
        <table className='tableContasReceber'>
                <thead>
                    <tr>
                        <td>Número da parcela</td>
                        <td>Valor</td>
                        <td>Data de Vencimento</td>
                        <td>Acao</td>
                    </tr>
                </thead>
                <tbody>
                    
                </tbody>
            </table>
        </div>
        <button type="button" onClick={voltarHome} className="buttonBack">Voltar</button>
    </div>

    );
}
export default ListarContasReceber;