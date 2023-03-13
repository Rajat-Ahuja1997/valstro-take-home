import { io, Socket } from 'socket.io-client';
import * as readline from 'readline';
import { ApiResponse } from './interface';

class SocketClient {
  private apiUrl: string = 'http://localhost:3000';
  public socket: Socket;
  // @ts-ignore
  private rl: readline.Interface;

  constructor() {
    if (process.env.HOST) {
      this.apiUrl = `http://${process.env.HOST}:3000`;
    }  
    this.socket = io(this.apiUrl);
  }

  listen = () => {
    this.registerEventListeners();
  }

  registerEventListeners = () => {
    this.socket.on('connect', () => {
      console.log('-- client connected')
    
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      this.query();
    });

    this.socket.on('error', (err) => {
      console.log(`ERR: ${err}`);
      this.query();
    });

    this.socket.on("connect_error", (err) => {
      console.log(`Connection error due to ${err.message}`);
    });
    
    this.socket.on('disconnect', () => {
      this.rl.close();
      console.log('client disconnected');
    });
    
    this.socket.on('search', (res: ApiResponse) => { 
      console.log(this.formatResult(res));
    
      if (res.resultCount === res.page) {
        this.query();
      }
    });
  }
  
  query = () => {      
    this.rl.question('What character would you like to search for? ', (query: string) => {
      if (!query) {
        this.close();
        return;
      }
  
      console.log(`Searching for ${query}...`)
      
      this.socket.emit('search', {query: query});
    });
  };
  
  formatResult = (res: ApiResponse) => {
    if (res.resultCount !== -1) {
      return `(${res.page}/${res.resultCount}) ${res.name} - [${res.films}]`;
    } else {
      return `ERR: ${res.error}`;
    }
  }
  
  close = () => {
    console.log('I find your lack of faith disturbing.');
    this.socket.close();
  }
}

export default SocketClient;
