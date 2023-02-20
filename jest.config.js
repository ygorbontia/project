module.exports = {
  // bail: true indica que o teste vai pausar no momento que um teste der erro
  bail: true,

  // Definindo o provider
  coverageProvider: "v8",

  // Definindo o padrão dos arquivos de teste
  testMatch: [
    // Definindo que dentro da pasta src, independente da pasta, o arquivo de teste vai ser da extensão .spec.js
    "<rootDir>/src/**/*.spec.js"
  ],
}