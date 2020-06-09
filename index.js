const Commander = require('commander');
const Database = require('./database');
const Heroi = require('./heroi');

async function main(){
  Commander
  .version('v1')
  .option('-n, --nome [value]', 'Nome do heroi')
  .option('-p, --poder [value]', 'Poder do heroi')
  .option('-i, --id [value]', 'Id do heroi')
  .option('-c, --cadastrar', 'Cadastrar um heroi')
  .option('-l, --listar', 'Listar herois')
  .option('-r, --remover [value]', 'Remover um heroi')
  .option('-a, --atualizar [value]', 'Atualizar heroi pelo id')
  .parse(process.argv);
  const heroi = new Heroi(Commander);
  try {
    if(Commander.cadastrar){
      delete heroi.id;
      const resultado = await Database.cadastrarHeroi(heroi);
      if(!resultado){
        console.error('lascou.. heroi não cadastrado.', error);
        return;
      }
      console.log('>> heroi cadastrado com sucesso. <<');      
    }

    if(Commander.listar){
      const resultado =  await Database.listar();
      if(resultado.length  === 0){
        console.error('>> nenhum heroi para listar. <<');
        return;
      }
      console.log(resultado);
      
    }

    if(Commander.remover){
      if(heroi.id < 0){
        console.error('id de heroi não informado.');
        return;
      }
      const resultado = await Database.removerHeroiPorId(heroi.id);
      if(!resultado){
        console.error('lascou...', error);
        return;
      }
      console.log('>> heroi removido com sucesso. <<');      
    }

    if(Commander.atualizar){
      const idParaAtualizar = parseInt(Commander.atualizar);
      const dado = JSON.stringify(heroi);
      const heroiAtualizar = JSON.parse(dado);
      const resultado = await Database.atualizarHeroiPorId(idParaAtualizar, heroiAtualizar);
      if(!resultado){
        console.error('lascou...heroi não atualizado.', error);
        return;
      }
      console.log('heroi atualizado com sucesso.');
      
    }

  } catch (error) {
    console.error('lascou...', error);    
  }
}

main();