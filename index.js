// modulos externos
const inquirer = require("inquirer");
const chalk = require("chalk");
// modulos internos
const fs = require("fs");

console.log("iniciamos o Accounts");
operation()

function operation() {
    inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "O que você deseja fazer?",
      choices: ["Criar conta", "Consultar Saldo", "Depositar", "Sacar", "Sair"],
    }
  ])
  .then((answer => {
    const action = answer['action']

    if(action === 'Criar conta'){
      createAccount();
    }else if(action === 'Consultar Saldo'){
      getEaccountBalance()
    }else if(action === 'Depositar'){
      deposit()      
    }
    else if(action === 'Sacar'){
      withdraw()
    }
    else if(action === 'Sair'){
      console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
      process.exit()
    }

  }))
  .catch((err) => console.log(err))
}

function createAccount() {
  console.log(chalk.bgGreen('Parabens por escolher o nosso banco!'))
  console.log(chalk.green('Defina as opções da sua conta a seguir'))
  buildAccount()
}

function buildAccount() {

  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Digite o nome para a sua conta:'
    }
  ]).then((answer) => {

    const accountName = answer['accountName']
    console.info(accountName)

    if(!fs.existsSync('accounts')){
      fs.mkdirSync('accounts')
    }
    if(fs.existsSync(`accounts/${accountName}.json`)){
      console.log(chalk.bgRed('Esta conta já existe, escolha outro nome!'))
      buildAccount()
      return
    }

    fs.writeFileSync(`accounts/${accountName}.json`, '{"balance":0}', function (err) {
      console.log(err)
    })

    console.log(chalk.green('Parabens, sua conta foi criada!'))
    operation()

  }).catch((err) => console.log(err))

}

function deposit(){

  inquirer.prompt([{
    name: 'actionAccountName',
    message: 'Digite o nome da sua conta:'
  }]).then((answer) => {

    var AccountName = answer['actionAccountName']

    if(!checkAccount(AccountName)){
      return deposit()
    }

    inquirer.prompt([{
      name:'amount',
      message: 'Quando deseja depositar?'
    }]).then((answer) => {

      const amount = answer['amount']

      addAmount(AccountName, amount)

    }).catch((err) => console.log(`erro es un error: ${err}`))

  }).catch((err) => console.log(err))

}

function checkAccount(accountName){

  if(!fs.existsSync(`accounts/${accountName}.json`)){
    console.log(chalk.bgRed('Esta conta não existe, tente novamente'))
    return false
  }else{
    return true
  }

}

function addAmount(accountName, amount){

  const accountData = getAccount(accountName)

  if(!amount){
    console.log(chalk.bgRed('Occoreu um erro, tente novamente!'))
    return deposit()
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err)
    }
  )

  console.log(chalk.green(`Foi depositado R$${amount} na sua conta!`))
  operation()

}

function getAccount(accountName){
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: 'utf-8',
    flag: 'r',
  })

  return JSON.parse(accountJSON)
}

function getEaccountBalance() {
  inquirer.prompt([{
    name: 'accountName',
    message: 'Digite o nome da sua conta:'
  }]).then((answer) => {

    const accountName = answer['accountName']

    if(!checkAccount(accountName)){
      return getEaccountBalance()
    }

    const accountData = getAccount(accountName)

    console.log(chalk.green(`Seu saldo é de R$${accountData.balance}`))

    operation()

  }).catch((error) => console.log(err))
}

function withdraw(){

  inquirer.prompt([{
    name: 'AccountName',
    message: 'Digite o nome da sua conta:'
  }]).then((answer) => {

    const accountName = answer['AccountName']

    if(!checkAccount(accountName)){
      console.log(chalk.bgRed('A conta não existe!'))
    }

    inquirer.prompt([{
      name: 'amount',
      message: 'Quando deseja sacar?'
    }]).then((answer) => {

      const amount = answer['amount'];

      removeAmount(accountName, amount)

    }).catch((err) => console.log(err))

  }).catch((err) => console.log(err))

}

function removeAmount(accountName, amount){

  const accountData = getAccount(accountName)

  if(!amount){
    console.log(chalk.bgRed('Ocorreu um erro, tente novamente!'))
    return withdraw()
  }

  if(accountData.balance < amount){
    console.log(chalk.bgRed('O valor esta indisponivel'))
    return withdraw()
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err)
    }
  )

  console.log(chalk.green(`Foi realizado um saque de R$${amount} na sua conta`))
  console.log(chalk.green(`Saldo atualizado para R$${accountData.balance}`))

  operation()

}