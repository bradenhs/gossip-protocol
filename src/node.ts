import * as express from 'express'
import * as uuid from 'uuid'
import * as http from 'http'
import * as createIO from 'socket.io'
import * as path from 'path'
import axios from 'axios'
import * as bodyParser from 'body-parser'

export class Node {
  id = uuid.v4()
  availablePeers: string[] = [];
  peers: Node[] = [];
  app: express.Application;
  server: http.Server;
  io: SocketIO.Server;

  nodeMessages: {
    [id: string]: {
      id: string;
      message: string;
      seq: number;
    }[]
  } = {}

  constructor(public name: string, public port: number) {
    this.app = express()
    this.app.use(bodyParser.json());
    this.server = http.createServer(this.app)
    this.io = createIO(this.server)

    this.nodeMessages[this.id] = []

    let socket: SocketIO.Socket;

    this.io.on('connection', s => {
      socket = s
      socket.emit('node', this.toJSON())
      socket.on('activate', id => {
        this.availablePeers.push(id)
        axios.post(
          this.peers.find(p => p.id === id).url + '/connect',
          { id: this.id, }
        );
      })
      socket.on('deactivate', id => {
        let index = this.availablePeers.indexOf(id)
        this.availablePeers.splice(index, 1)
        axios.post(
          this.peers.find(p => p.id === id).url + '/disconnect',
          { id: this.id, }
        );
      })
      socket.on('messageClient', message => {
        let seq = this.nodeMessages[this.id].length + 1
        this.nodeMessages[this.id].push({
          id: this.id, message, seq,
        })
        socket.emit('getMessage', message)
      })
    })

    this.app.get('/', (req, res) => {
      res.sendFile(path.resolve('./index.html'));
    })

    this.app.post('/connect', (req, res) => {
      this.availablePeers.push(req.body.id)
      socket.emit('connectPeerFromServer', { id: req.body.id });
      res.end()
    })

    this.app.post('/disconnect', (req, res) => {
      let index = this.availablePeers.findIndex(id => id === req.body.id)
      this.availablePeers.splice(index, 1)
      socket.emit('disconnectPeerFromServer', { id: req.body.id });
      res.end()
    })

    this.app.post('/message', (req, res) => {
      let response: { message: string, seq: number, id: string }[] = []
      Object.keys(req.body).forEach(key => {
        if (this.nodeMessages[key] !== undefined) {
          if (req.body[key] < this.nodeMessages[key].length) {
            response = [
              ...response,
              ...this.nodeMessages[key].filter(nm => nm.seq > req.body[key])
            ]
          }
        }
      })
      res.json(response)
    })

    setInterval(() => {
      let peer = this.getPeer()
      if (peer == undefined) {
        return;
      }
      axios.post(peer.endpoint, this.getState()).then(response => {
        let data: { message: string, seq: number, id: string }[] = response.data
        data.forEach(item => {
          socket.emit('getMessage', item.message)
          this.nodeMessages[item.id].push({
            message: item.message,
            id: item.id,
            seq: item.seq
          });
        })
      }).catch(() => {
      })
    }, 2500)
  }

  getState() {
    let state: { [key: string]: number } = {};
    Object.keys(this.nodeMessages).forEach(key => {
      state[key] = this.nodeMessages[key].length
    })
    return state;
  }

  getPeer() {
    const id = this.availablePeers[this.rand(0, this.availablePeers.length - 1)]
    return this.peers.find(p => p.id === id)
  }

  rand(min, max) {
    return Math.round(Math.random() * (max - min)) + min
  }

  get endpoint() {
    return this.url + '/message'
  }

  get url() {
    return `http://localhost:${this.port}`
  }

  addPeer(peer: Node, active: boolean) {
    this.peers.push(peer)
    this.nodeMessages[peer.id] = []
    if (active) {
      this.availablePeers.push(peer.id)
    }
  }

  activatePeer(peerId: string) {
    if (this.availablePeers.indexOf(peerId) === -1) {
      this.availablePeers.push(peerId)
    }
  }

  deactivatePeer(peerId: string) {
    let index = this.availablePeers.indexOf(peerId)
    if (index !== -1) {
      this.availablePeers.splice(index, 1)
    }
  }

  start() {
    this.server.listen(this.port)
  }

  toJSON() {
    return {
      name: this.name,
      peers: this.peers.map(p => {
        return { name: p.name, id: p.id, active: this.availablePeers.find(id => id === p.id) !== undefined }
      })
    }
  }
}
