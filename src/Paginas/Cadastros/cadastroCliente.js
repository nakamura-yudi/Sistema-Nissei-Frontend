import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
function Formulario()
{
    const [cpf,setCpf] = useState('');
    const [nome,setNome] = useState('');
    const [sexo,setSexo] = useState('');
    const [email,setEmail] = useState('');
    const [bairro,setBairro]=useState('');
    const [rua,setRua]=useState('');
    const [cidade,setCidade]=useState('');
    const [uf,setUf]=useState('');
    const [cep,setCep]=useState('');


    const[tpCont,setTpCont]=useState('');
    const [verContatos,setContatos]=useState([]);
    const [numero,setNumero]=useState('');

    const [isOpen,setIsOpen]=useState(true);
    const [button,setButton]=useState('Salvar');
    const [titulo,setTitulo]=useState('Cadastro');
    useEffect(()=>{
        if(localStorage.getItem('cod_cli')!==null)
        {
            alterarPessoa();
        }
    },[]);
    function voltarHome(){
        if(localStorage.getItem('cod_cli')!==null)
            localStorage.removeItem('cod_cli');
        history.goBack();
    } 
    async function alterarPessoa(){
        setTitulo("Alterar Perfil");
        setButton("Alterar");
        const cpf_input =  document.querySelector("#cpf");
        cpf_input.disabled=true;
        setIsOpen(false);
        console.log(localStorage.getItem('cod_cli'));
        const response = await api.get(`/pessoaCod/${localStorage.getItem('cod_cli')}`).then((resp)=>{
            setNome(resp.data[0].pes_nome);
            setCpf(resp.data[0].pes_cpf);
            setSexo(resp.data[0].pes_sexo);
            setEmail(resp.data[0].pes_email);
        });

        const response2 = await api.get(`/clienteCod/${localStorage.getItem('cod_cli')}`).then((resp)=>{
                setBairro(resp.data[0].cli_bairro);
                setRua(resp.data[0].cli_rua);
                setCidade(resp.data[0].cli_cidade);
                setUf(resp.data[0].cli_uf);
                setCep(resp.data[0].cli_cep);
        });
        
    }
    

    function vazio(valor)
    {
        let v=''+valor;
        if(v.length<=0)
            return true;
        return false;
    }
    function validarUF(valor){
        if(/[A-Z]{2}/.test(valor))
            return true;
        return false;
    }
    function validarCep(valor){
        if(/[0-9]{5}[\-][0-9]{2}/.test(valor))
            return true;
        return false;
    }
    function validarCPF(valor)
    {
        if(/[0-9]{3}[\.][0-9]{3}[\.][0-9]{3}[\-][0-9]{2}/.test(valor))
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
    function validarTelefone(valor)
    {
        if(/[a-zA-Z]/.test(valor))
        return false;
        else
        {
        if(/^\([1-9]{2}\)[0-9]{5}\-[0-9]{4}/.test(valor) || /^\([1-9]{2}\)[0-9]{4}\-[0-9]{4}/.test(valor))
            return true;
        else
            return false;
        }
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
    async function validarCPFRepetido(valor){
        const response = await api.get('/pessoaCpf/'+valor).then((resp)=>{
        
        if(resp.data.length>0)
            return false;
        else
            return true;
        })
        return response;
    }
    
    async function addLista(){
        let mensagem = document.querySelector("#mensagemContato");
        mensagem.innerHTML="";
        if(validarTelefone(numero) && !vazio(tpCont))
        { 
            let tam=verContatos.length;
            const data= {
                codigo:tam,
                numero: numero,
                tipo:tpCont
                };
            setTpCont('');
            setNumero('');
            setContatos([...verContatos, data]); //contatos é um estado (do tipo vetor)    
        }
        else
        {
            if(!validarTelefone(numero))
                mensagem.innerHTML+="<p>Número não válido</p>";
            if(vazio(tpCont))
                mensagem.innerHTML+="<p>Tipo de número vazia</p>";
        }
    }

    async function confirmarDados(e){
        e.preventDefault();
        let mensagem = document.querySelector("#mensagem");
        
        const respCPF= await validarCPFRepetido(cpf);
        var confere=false;

        if(validarCep(cep) && validarCPF(cpf) && validarEmail(email) && validarSexo(sexo) && validarUF(uf))
        {
            if(button==="Salvar")
            {
                mensagem.innerHTML="";
                if(respCPF)
                {
                    
                    let codUser;
                    const response=await api.post('/pessoas',{
                        pes_nome:nome,
                        pes_cpf:cpf,
                        pes_sexo:sexo,
                        pes_email:email
                    })

                    codUser=response.data.lastId;
                    const response2=await api.post('/clientes',{
                        pes_cod:codUser,
                        cli_bairro:bairro,
                        cli_rua:rua,
                        cli_cidade:cidade,
                        cli_uf:uf,
                        cli_cep:cep
                    })

                    
                    for(let i=0;i<verContatos.length;i++)
                    {
                        const response3=await api.post('/contatos',{
                            pes_cod:codUser,
                            cont_numero:verContatos[i].numero,
                            cont_tipo:verContatos[i].tipo
                        })
                        
                    }
                    alert('Usuário cadastrado');
                    setNome('');
                    setCpf('');
                    setSexo('');
                    setEmail('');
                    setBairro('');
                    setRua('');
                    setCidade('');
                    setUf('');
                    setCep('');
                    setNumero('');
                
                    history.goBack();
                } 
                else
                {
                    mensagem.innerHTML="<p>CPF já cadastrado</p>";
                }
            }
            else{
                const response=await api.put('/pessoa',{
                    pes_nome:nome,
                    pes_cpf:cpf,
                    pes_sexo:sexo,
                    pes_email:email
                })
                const response2=await api.put('/clientes',{
                    pes_cod:localStorage.getItem('cod_cli'),
                    cli_bairro:bairro,
                    cli_rua:rua,
                    cli_cidade:cidade,
                    cli_uf:uf,
                    cli_cep:cep
                })

                alert('Alterado');
                localStorage.removeItem('cod_cli');
                history.goBack();
            }
        }
        else
        {
            mensagem.innerHTML="";
            if(!validarCep(cep))
            mensagem.innerHTML+="<p>CEP inválido</p>";
            if(!validarCPF(cpf))
            mensagem.innerHTML+="<p>CPF inválido</p>";
            if(!validarEmail(email))
            mensagem.innerHTML+="<p>Email inválido</p>";
            if(!validarSexo(sexo))
            mensagem.innerHTML+="<p>Sexo vazio</p>";
            if(!validarUF(uf))
            mensagem.innerHTML+="<p>UF inválido</p>";
        }
    
    }
    return (
        <div id="tela">
            <div id='app'>
                <aside id="formulario" >
                    <h1>{titulo}</h1>
                    <form onSubmit={confirmarDados} >
                        <label htmlFor="nome">Nome</label>
                        <input name="nome" id="nome" value={nome} onChange={e=>setNome(e.target.value)} required/>


                        <label htmlFor="cpf">CPF</label>
                        <input name="cpf" id="cpf" value={cpf} onChange={e=>setCpf(e.target.value)} placeholder="xxx.xxx.xxx-xx" required/>


                        <label htmlFor="email">Email</label>
                        <input name="email" id="email" value={email} onChange={e=>setEmail(e.target.value)} required/>

                        <label htmlFor="Sexo">Sexo</label>
                        <label className="input-block">Feminino
                            <input type="radio" name="Sexo" id="Sexo" value="F" checked={sexo==='F'} onClick={e=>setSexo(e.target.value)} onChange={e=>setSexo(e.target.value)}/>
                        </label>
                        <label className="input-block">Masculino
                            <input type="radio" name="Sexo" id="Sexo" value="M" checked={sexo==='M'} onClick={e=>setSexo(e.target.value)} onChange={e=>setSexo(e.target.value)}/>
                        </label>

                        <label htmlFor="cep">CEP</label>
                        <input name="cep" id="cep" value={cep} onChange={e=>setCep(e.target.value)} required/>

                        <label htmlFor="rua">Rua</label>
                        <input name="rua" id="rua" value={rua} onChange={e=>setRua(e.target.value)} required/>
                        
                        <label htmlFor="bairro">Bairro</label>
                        <input name="bairro" id="bairro" value={bairro} onChange={e=>setBairro(e.target.value)} required/>

                        <label htmlFor="cidade">Cidade</label>
                        <input name="cidade" id="cidade" value={cidade} onChange={e=>setCidade(e.target.value)} required/>
                        
                        <label htmlFor="uf">UF</label>
                        <input name="uf" id="uf" value={uf} onChange={e=>setUf(e.target.value)} required/>
                        <div id="mensagem">

                        </div>
                        {isOpen &&
                            <div id="cadastroContato">
                                <h1>Cadastrar Contato</h1>
                
                                <div className="input-block" id="block-foneContato">
                                    <label htmlFor="numero">Número de contato</label>
                                    <input name="numero" id="numero" value={numero} onChange={e=>setNumero(e.target.value)} placeholder="(xx)xxxxx-xxxx" />

                                    <label htmlFor="tipoCont">Tipo de contato</label>
                                    <select id="tipoCont" onChange={e=>setTpCont(e.target.value)} value={tpCont}>
                                        <option id="op-vazio" valie=''> </option>
                                        <option id="op-contA" value="Residencial">Residencial</option>
                                        <option id="op-contB" value="Comercial">Comercial</option>
                                        <option id="op-contC" value="Celular">Celular</option>
                                    </select>
                                </div>
                                <div id="mensagemContato">

                                </div>
                                <button type="button" onClick={addLista} id="btnFormContato">Cadastrar Contato</button>
                                <div id="divTable">
                                    <table id="tabela">
                                        <thead>
                                            <tr>
                                                <td>Telefones</td>
                                                <td>Tipo</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {verContatos.map(contato=>(
                                                <tr key={contato.codigo}>
                                                    <td>{contato.numero}</td>     
                                                    <td>{contato.tipo}</td>            
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                            </div> 
                        }             
                             
                        <button type="submit" id="btnForm">{button}</button>
                    </form>
                    <button type="button" onClick={voltarHome}>Sair</button>
                </aside>    
            </div>
        </div>
    );
}

export default Formulario;