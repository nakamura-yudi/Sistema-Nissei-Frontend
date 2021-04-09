import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import './cadastroFuncionario.css'
import Header from '../../Components/Header'
function FormularioFuncionario()
{
    const [cpf,setCpf] = useState('');
    const [nome,setNome] = useState('');
    const [sexo,setSexo] = useState('');
    const [email,setEmail] = useState('');
    const [emailAtual,setEmailAtual] = useState('');
    const [ano,setAno] = useState(0);
    const [senha,setSenha]=useState('');
    const [confSenha,setConfSenha]=useState('');
    const [isOpen,setIsOpen]=useState(false);
    const [button,setButton]=useState('Salvar');
    const [titulo,setTitulo]=useState('Cadastrar Funcionário');
    useEffect(()=>{
        if(localStorage.getItem('cod_fun')!==null)
        {
          alterarFuncionario();
        }
        if(localStorage.getItem('user')!=null)
            setIsOpen(true);
   
    },[]);
      
    async function alterarFuncionario(){
          
        setTitulo("Alterar Perfil");
        setButton("Alterar");
        const cpf_input =  document.querySelector("#cpf");
        cpf_input.disabled=true;
      
        const response = await api.get(`/pessoaCod/${localStorage.getItem('cod_fun')}`).then((resp)=>{
            setNome(resp.data[0].pes_nome);
            setCpf(resp.data[0].pes_cpf);
            setSexo(resp.data[0].pes_sexo);
            setEmail(resp.data[0].pes_email);
            setEmailAtual(resp.data[0].pes_email);
        });
        const response2 = await api.get(`/func/${localStorage.getItem('cod_fun')}`).then((resp)=>{
            setAno(resp.data[0].fun_anoInicio);
            setSenha(resp.data[0].fun_senha);
            setConfSenha(resp.data[0].fun_senha);
        });
    }
    function voltarHome(){
        if(localStorage.getItem('cod_fun')!==null)
            localStorage.removeItem('cod_fun');
        history.goBack();
    } 
    function vazio(valor)
    {
        let v=''+valor;
        if(v.length<=0)
            return true;
        return false;
    }
    
    function validarCPF(valor)
    {
        var reg=/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
        if(valor.match(reg)!=null)
            return true;
        return false;
    }
    function validarEmail(valor)
    {
        var exp = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]/i;
        if(exp.test(valor))
            return true;
        return false;
    }
    function validarAno(){
        var now=new Date();
        if(ano>=0 && ano<=now.getFullYear())
            return true;
        return false;
    }

    function validarTexto(valor)
    {
        if(!/[0-9]/.test(valor))
        return true;
        else
        return false;
    }

    function validarSexo(valor){
        if(valor==='M' || valor==='F')
        return true;
        return false;
    }
    function validarSenha(valor1,valor2){
        if(valor1===valor2)
        return true;
        return false;
    }
    async function validarCPFRepetido(valor){
        const response = await api.get('/pessoaCpf/'+valor).then((resp)=>{
        
        if(resp.data.length>0)
            return false;
        else
            return true;
        })
        return response;
    }
    async function validarEmailRepetido(valor){
        const response = await api.get('/pessoaProcurarEmail/'+valor).then((resp)=>{
        
        if(resp.data.length>0)
            return false;
        else
            return true;
        })
        return response;
    }
    

    async function adicionarFunc(e){
        e.preventDefault();
        let mensagem = document.querySelector("#mensagem");
        var confere=false;
        const respCPF= await validarCPFRepetido(cpf);
        const respEmail= await validarEmailRepetido(email);
        var confere=false;

        if(validarCPF(cpf) && validarEmail(email) && validarSexo(sexo) && validarSenha(senha,confSenha) && validarAno(ano))
        {
            if(button==="Salvar")
            {
                mensagem.innerHTML="";
                if(respCPF && respEmail)
                {
                    let codUser;
                    const response=await api.post('/pessoas',{
                        pes_nome:nome,
                        pes_cpf:cpf,
                        pes_sexo:sexo,
                        pes_email:email
                    })
                    
                    codUser=response.data.lastId;

                    const response2=await api.post('/func',{
                        pes_cod:codUser,
                        fun_anoInicio: ano,
                        fun_senha:senha
                    })
                    alert('Usuário cadastrado');
                    setNome('');
                    setCpf('');
                    setSexo('');
                    setEmail('');
                    setAno(0);
                    history.goBack();
                } 
                else
                {
                    if(!respCPF)
                    mensagem.innerHTML="<p>CPF já cadastrado</p>";
                    if(!respEmail)
                    mensagem.innerHTML+="<p>Email já cadastrado</p>";
                }
            }
            else{
                if(email!==emailAtual)
                {
                    if(!respEmail)
                        confere=false;
                    else
                        confere=true;
                }
                if(email===emailAtual || confere){
                    const response=await api.put('/pessoa',{
                        pes_cod: localStorage.getItem('cod_fun'),
                        pes_nome:nome,
                        pes_cpf:cpf,
                        pes_sexo:sexo,
                        pes_email:email
                    })
                    const response2=await api.put('/func',{
                        pes_cod: localStorage.getItem('cod_fun'),
                        fun_anoInicio:ano,
                        fun_senha:senha
                    })
                    alert('Funcionário Alterado');
                    localStorage.removeItem('cod_fun');
                    history.goBack();
                }
                else{
                    mensagem.innerHTML+="<p>Email já cadastrado</p>"
                }
            }
        }
        else
        {
            mensagem.innerHTML="";

            if(!validarCPF(cpf))
            mensagem.innerHTML+="<p>CPF inválido</p>";
            if(!validarEmail(email))
            mensagem.innerHTML+="<p>Email inválido</p>";
            if(!validarSexo(sexo))
            mensagem.innerHTML+="<p>Sexo vazio</p>";
            if(!validarSenha(senha,confSenha))
            mensagem.innerHTML+="<p>Senhas diferentes</p>"
            if(!validarAno(ano))
            mensagem.innerHTML+="<p>Ano inválido. Não pode ser negativo nem maior que o ano atual</p>"
        }
    }

    return (
       
            <div className='background'>
                {isOpen &&
                    <Header/>
                }
                <div className="div-funcionario" >
                    <h1>{titulo}</h1>
                    <form className='form-funcionario' onSubmit={adicionarFunc}>
                        <div className="input-block block-nome" >
                            <label htmlFor="nome">Nome</label>
                            <input name="nome" id="nome" value={nome} onChange={e=>setNome(e.target.value)} required/>
                        </div>

                        <div className="input-block block-cpf">
                            <label htmlFor="cpf">CPF</label>
                            <input name="cpf" id="cpf" value={cpf} onChange={e=>setCpf(e.target.value)} placeholder="xxx.xxx.xxx-xx" required/>
                        </div>

                        <div className="input-block block-email">
                            <label htmlFor="email">Email</label>
                            <input name="email" id="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
                        </div>

                        <div className="input-block block-sexo" >
                            <label htmlFor="Sexo">Sexo</label>
                            <label className="input-block">Feminino
                                <input type="radio" name="Sexo" id="Sexo" value="F" checked={sexo==='F'} onClick={e=>setSexo(e.target.value)} onChange={e=>setSexo(e.target.value)}/>
                            </label>
                            <label className="input-block">Masculino
                                <input type="radio" name="Sexo" id="Sexo" value="M" checked={sexo==='M'} onClick={e=>setSexo(e.target.value)} onChange={e=>setSexo(e.target.value)}/>
                            </label>
                        </div>
                        
                        <div className="input-block block-data" >
                            <label htmlFor="uf">Ano de inicio</label>
                            <input type="number" name="ano" id="ano" value={ano} onChange={e=>setAno(e.target.value)} required/>
                        </div>

                        <div className="input-block block-data" >
                            <label htmlFor="senha">Senha</label>
                            <input type="password" name="senha" id="senha" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="Digite a sua senha"required/>
                        </div>

                        <div className="input-block block-data" >
                            <label htmlFor="confSenha">Confirmar Senha</label>
                            <input type="password" name="confSenha" id="confSenha" value={confSenha} onChange={e=>setConfSenha(e.target.value)} placeholder="Confirme a sua senha" required/>
                        </div>
                        <div id="mensagem">

                        </div>
                                
                             
                        <button type="submit" id="btnForm">{button}</button>
                    </form>
                    <button type="button" onClick={voltarHome}>Voltar</button>
                </div>    
            </div>
      
    );
}

export default FormularioFuncionario;