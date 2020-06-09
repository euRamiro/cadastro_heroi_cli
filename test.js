const { deepEqual, ok } = require("assert");

const database = require('./database');

const DEFAULT_HEROI_CADASTRAR = {
  nome: 'Naruto',
  poder: 'jeito ninja',
  id: 1,
};
const DEFAULT_HEROI_ATUALIZAR ={
  nome: 'Coragem o cão convarde',
  poder: 'medo',
  id: 2,
}

describe("Suite de manipulação de herois", () => {  
  before(async () => {
    await database.cadastrarHeroi(DEFAULT_HEROI_CADASTRAR);
    await database.cadastrarHeroi(DEFAULT_HEROI_ATUALIZAR);
  });
  
  it('deve pesquisar um heroi', async () => {
    const expected = DEFAULT_HEROI_CADASTRAR;
    const [resultado] = await database.listar(expected.id);
    deepEqual(resultado, expected); 
  });
  
  it("deve cadastrar um heroi", async () => {
    const expected = DEFAULT_HEROI_CADASTRAR;
    const resultado = await database.cadastrarHeroi(DEFAULT_HEROI_CADASTRAR);
    const [atual] = await database.listar(DEFAULT_HEROI_CADASTRAR.id);
    deepEqual(atual, expected);
  });

  it('deve remover um heroi pelo id', async () => {
    const expected = true;
    const resultado = await database.removerHeroiPorId(DEFAULT_HEROI_CADASTRAR.id);
    deepEqual(resultado, expected); 
  });

  it('deve atualizar um heroi pelo id', async () => {
    const expected = {
      ...DEFAULT_HEROI_ATUALIZAR,
      nome: 'Detona Ralph',
      poder: 'quebrar'
    };
    const novoDado = {
      nome: 'Detona Ralph',
      poder: 'quebrar'
    };
    await database.atualizarHeroiPorId(DEFAULT_HEROI_ATUALIZAR.id, novoDado);
    const [resultado] = await database.listar(DEFAULT_HEROI_ATUALIZAR.id);
    deepEqual(resultado, expected);
  });

  after(async () => {
    await database.removerHeroiPorId(DEFAULT_HEROI_CADASTRAR.id);
    await database.removerHeroiPorId(DEFAULT_HEROI_ATUALIZAR.id);
  });
});
