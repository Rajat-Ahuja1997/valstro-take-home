import { ApiResponse } from '../src/interface';
import SocketClient from '../src/socketClient';

jest.mock('socket.io-client', () => ({
  io: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    close: jest.fn(),
  })),
}));

describe('SocketClient', () => {
  let socketClient: SocketClient;

  beforeEach(() => {
    socketClient = new SocketClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should use the correct API URL when process.env.HOST is defined', () => {
      const host = 'test-host';
      process.env.HOST = host;
      const socketClient = new SocketClient();

      expect(socketClient['apiUrl']).toBe(`http://${host}:3000`);

      delete process.env.HOST;
    });

    it('should use the correct API URL when process.env.HOST is undefined', () => {
      const socketClient = new SocketClient();
      expect(socketClient['apiUrl']).toBe(`http://localhost:3000`);
    });
  });

  describe('listen', () => {
    it('should call the registerEventListeners function', () => {
      socketClient.registerEventListeners = jest.fn();
      socketClient.listen();
      expect(socketClient.registerEventListeners).toHaveBeenCalled();
    });
  });

  describe('registerEventListeners', () => {
    it('should listen to the socket events', () => {
      const onMock = jest.fn();
      socketClient.socket.on = onMock;

      socketClient.registerEventListeners();
    
      expect(onMock).toHaveBeenCalledWith('connect', expect.any(Function));
      expect(onMock).toHaveBeenCalledWith('error', expect.any(Function));
      expect(onMock).toHaveBeenCalledWith('connect_error', expect.any(Function));
      expect(onMock).toHaveBeenCalledWith('disconnect', expect.any(Function));
      expect(onMock).toHaveBeenCalledWith('search', expect.any(Function));
    });
  });

  describe('formatResult', () => {
    it('should return the formatted result', () => {
      const result: ApiResponse = {
        page: 1,
        resultCount: 1,
        name: 'Luke Skywalker',
        films: 'A New Hope, The Empire Strikes Back, Return of the Jedi, Revenge of the Sith'
      };
      const expected = '(1/1) Luke Skywalker - [A New Hope, The Empire Strikes Back, Return of the Jedi, Revenge of the Sith]';

      expect(socketClient.formatResult(result)).toBe(expected);
    });

    it('should return an error message if resultCount is -1', () => {
      const result = {
        page: 1,
        resultCount: -1,
        error: 'not found',
      };
      const expected = 'ERR: not found';

      expect(socketClient.formatResult(result)).toBe(expected);
    });
  });

  describe('close', () => {
    it('should close the socket', () => {
      socketClient.close();

      expect(socketClient.socket.close).toHaveBeenCalled();
    });
  });
});
