import * as chalk from 'chalk'
import * as opn from 'opn'
import * as inquirer from 'inquirer'
import * as adjNoun from 'adj-noun'
import * as singleLineLog from 'single-line-log'
import { Node } from './node'

adjNoun.seed(Math.floor(Math.random() * 1000))

init()

async function init() {
  console.log(chalk.cyan(`****************************`))
  console.log(chalk.cyan(`**                        **`))
  console.log(chalk.cyan(`**    Gossip Lab Setup    **`))
  console.log(chalk.cyan(`**                        **`))
  console.log(chalk.cyan(`****************************`))

  console.log()

  promptUser()
}

async function promptUser() {
  const numNodes = parseInt(
    await question('How many nodes would you like to start?', 'input', validateNodes),
    10,
  )

  console.log()
  await log(format(`Awesome! Here's the plan:`, chalk.magenta))
  console.log()
  await log(format(`I'm going to start a node at each of the following addresses.`, chalk.cyan))
  console.log()

  const basePort = 3000

  const nodeCollection: Node[] = []
  for (let port = basePort; port < basePort + numNodes; port++) {
    let node = new Node(adjNoun().join('-'), port)
    nodeCollection.push(node)
  }

  for (let i = 0; i < nodeCollection.length; i++) {
    let node = nodeCollection[i]
    for (let j = 0; j < nodeCollection.length; j++) {
      if (j !== i) {
        let diff = i - (i - j < 0 ? j - nodeCollection.length : j)
        node.addPeer(
          nodeCollection[j],
          diff === 1 || diff === numNodes - 1
        )
      }
    }
    await log([
      ...format(`http://localhost:${node.port}`, chalk.underline),
      ...format(' node name: ', chalk.dim.magenta),
      ...format(node.name, chalk.italic.magenta)
    ], 30)
  }

  console.log()

  await log(format(`Then I'll open a new browser window for each node.`, chalk.cyan))
  await log(format(`After that you'll be able to send messages from different`, chalk.cyan))
  await log(format(`nodes and watch them propogate across the network.`, chalk.cyan))

  console.log()

  let proceed = await question('Sound good?', 'confirm')

  if (proceed !== true) {
    return process.exit()
  }

  console.log()

  for (let node of nodeCollection) {
    singleLineLog.stdout(
      chalk.white.dim(`- Starting ${node.name} at `) +
      chalk.white.underline.dim(` http://localhost:${node.port}`)
    )
    await sleep(500)
    node.start()
    singleLineLog.stdout(
      chalk.magenta(`✓`) + chalk.magenta.dim(` Started `) + chalk.italic.magenta(`${node.name} `) +
      chalk.magenta.dim(`at `) +
      chalk.white.underline(`http://localhost:${node.port}\n`)
    )
    console.log()
  }

  console.log()

  singleLineLog.stdout(chalk.cyan.dim('Opening pages...'))

  await sleep(1000)

  await log(format('All nodes are up and running!', chalk.green))
  await log(format('(ctrl-c anytime to quit)', chalk.green.dim))

  for (let node of nodeCollection) {
    opn(`http://localhost:${node.port}`)
  }
}

function format(str: string, formatter: (v: string) => string) {
  return str.split('').map(v => formatter(v))
}

async function sleep(milliseconds = 100) {
  return new Promise(r => setTimeout(r, milliseconds))
}

function validateNodes(value: string) {
  if (/\d+/g.test(value) && parseInt(value, 10) > 2) {
    return true
  } else {
    return 'Value must be an integer greater than two.'
  }
}

function validatPeers(value: string) {
  if (/\d+/g.test(value) && parseInt(value, 10) > 0) {
    return true
  } else {
    return 'Value must be an integer greater than zero.'
  }
}

async function question(message: string, type: string, validate?) {
  await log(format(message, chalk.green.italic), 50)
  const { value } = await inquirer.prompt({
    name: 'value', validate, message: ':', type
  })
  return value;
}

async function log(letters: string[], delay = 50) {
  let word = '';

  for (let letter of letters) {
    word += letter
    singleLineLog.stdout(word)
    await sleep(delay)
  }
  singleLineLog.stdout.clear()
  console.log()
}
