<p align="center">
     <img src="images/Capa.png" alt="Logo" >

  <h5 align="center">Let's rock, baby.</h5>

  <p align="center">
    Projeto desenvolido durante a NLW 1.0
    <br />
    <a href="/">Versão web (em breve)</a>
    ·
    <a href="https://github.com/fernandadias/rockme/issues">Próximos passos</a>
  </p>
</p>

# 🎵 Sobre o projeto

O **Rock.Me** foi desenvolvido com base no Ecoleta, projeto utilizado na NLW 1.0 da **[Rockseat](https://rocketseat.com.br/)**.
A proposta foi uma aplicação web em React e mobile em React Native que consomem o mesmo back-end em Node.js.

Hoje o Rock.me tem a seguinte proposta:
* **Moods** já previamente cadastrados no banco
* Cadastro de **profile** pela aplicação web
* Esse cadastro já integrado com mapa para captura da geolocalização
* Integração com a API do IBGE para requisição de UFs e Cidades
* Pesquisa de **profiles** pelo app mobile
* Um único back-end que gerencia as requisições dos dois apps

### Stack
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/en/)
- [ReactJS](https://reactjs.org/)
- [React Native](https://reactnative.dev/)

### Layouts
O layout original do Ecoleta está disponível no **[Figma da Rockseat](https://www.figma.com/file/1SxgOMojOB2zYT0Mdk28lB/)**, e a minha versão **[no meu Figma](https://www.figma.com/file/vj769Mht3HujcrNBp6sUzu/RockMe-Ecoleta?node-id=0%3A1)**


# 🖥️ Para usar

### Requisitos

- **[Node.js](https://nodejs.org/en/)** instalado na máquina e de um gerenciador de dependencias (**[npm](https://www.npmjs.com/)** ou **[yarn](https://yarnpkg.com/)**)
- **[Expo](https://expo.io/)** instalado **globalmente**


```sh
  $ git clone https://github.com/fernandadias/rockme.git
```

```sh
  # Instalando as dependências
  $ npm install

  ## Criando o banco (scripts no package.json)
  $ cd server
  $ npm run knex:migrate
  $ npm run knex:seed

  # Rodando o back-end
  $ npm run dev

  # Rodando o app web
  $ cd ../web
  $ npm start

  # Rodando o app mobile
  $ cd ../mobile
  $ npm start
```

---

<h4 align="center">
    Feito com muita 🍺 durante a <a target="_blank" href="/https://nextlevelweek.com/">next level week 1.0</a>
</h4>
