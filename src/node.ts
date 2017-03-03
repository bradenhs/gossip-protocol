import * as express from 'express'

export function createNode(port: number, name: string) {
  return {
    port, name, start: createStarter(port, name),
  }
}

function createStarter(port, name) {
  return async function start() {
    return new Promise(resolve => {
      const node = express()
      node.get('/', (req, res) => {
        res.send(name)
      })
      node.listen(port, resolve)
    })
  }
}
