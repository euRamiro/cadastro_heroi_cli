const {readFile, writeFile} = require('fs');
const {promisify} = require('util');

//transformar a função que trabalhar com callback para promisses.
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

class Database{
  constructor() {
    this.NOME_ARQUIVO = 'herois.json';
  }
  
  async obterDadosArquivo(){
    const arquivo = await readFileAsync(this.NOME_ARQUIVO, 'utf8');
    return JSON.parse(arquivo.toString());
  }
  
  async escreverArquivo(dados){
    await writeFileAsync(this.NOME_ARQUIVO, JSON.stringify(dados));
    return true;
  }

  async gerarID() {
    const dados = await this.obterDadosArquivo()
 
    for (let index = 1; index <= dados.length + 1 ;index++) {            
        let resultado = dados.filter(item =>  item.id == index)            
        if (resultado.length==0) return(index)
    }

  }

  async cadastrarHeroi(heroi){
    const dados = await this.obterDadosArquivo();
    const id = heroi.id <= 2 ? heroi.id : await this.gerarID();
    const heroiComId = {
      id, 
      ...heroi
    }
    const dadosFinal = [
      ...dados, 
      heroiComId
    ]
    const resultado = await this.escreverArquivo(dadosFinal);
    return resultado;
  }

  async listar(id){
    const dados = await this.obterDadosArquivo();
    const dadosFiltrados = dados.filter(item => (id ? (item.id === parseInt(id)) : true));
    return dadosFiltrados;
  }

  async removerHeroiPorId(id){
    if(!id){
      return await this.escreverArquivo([]);
    } 
    const dados = await this.obterDadosArquivo();
    const indice = dados.findIndex(item => item.id === parseInt(id));
    if(indice === -1){
      throw Error('deu ruim. heroi não existe.');      
    }
    const atual = dados[indice];
    dados.splice(indice, 1);    
    return await this.escreverArquivo(dados);
  }

  async atualizarHeroiPorId(id, alteracoes){
    if(!id){
      throw Error('heroi não informado.');
    }
    const dados = await this.obterDadosArquivo();        
    const indice = dados.findIndex(item => item.id === parseInt(id));
      
    if (indice === -1){
      throw Error('deu ruim. heroi não existe.');
    }    

    const atual = dados[indice];
    const heroiAtualizar = {
      ...atual, 
      ...alteracoes
    }
    dados.splice(indice, 1);
    return await this.escreverArquivo([
      ...dados, 
      heroiAtualizar
    ]);
  }
}

module.exports = new Database();