// src/controllers/userController.test.js
const userController = require('./userController');
const userService = require('../services/userService');

// Mockar o módulo de serviço
jest.mock('../services/userService');

// Criar mocks para os objetos req, res e next
const mockRequest = (params = {}, body = {}) => ({
    params,
    body,
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

describe('UserController', () => {
    let res;

    beforeEach(() => {
        res = mockResponse();
        // Limpa os mocks antes de cada teste
        jest.clearAllMocks();
    });

    it('getAllUsers should return users with status 200', () => {
        const users = [{ id: 1, name: 'Test User' }];
        // Configura o mock do serviço para este teste
        userService.getAllUsers.mockReturnValue(users);

        const req = mockRequest();
        userController.getAllUsers(req, res);

        expect(userService.getAllUsers).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(users);
    });

    // ⬇️ ==========================================================
    // ⬇️ SMELL 1: CÓDIGO COMENTADO (DEAD CODE)
    // ⬇️ O SonarQube sinaliza isso como "Commented-out code should be removed".
    // ⬇️ ==========================================================
    // it('old test that no longer works', () => {
    //     const users = [];
    //     userService.getAllUsers.mockReturnValue(users);
    //     const req = mockRequest();
    //     userController.getAllUsers(req, res);
    //     expect(res.json).toHaveBeenCalledWith(users);
    //     expect(res.status).toHaveBeenCalledWith(201); // <-- Bug antigo
    // });
    // ⬆️ ==========================================================

    it('getUserById should return 404 if user not found', () => {
        userService.getUserById.mockReturnValue(undefined);

        const req = mockRequest({ id: '99' });
        userController.getUserById(req, res);

        expect(userService.getUserById).toHaveBeenCalledWith('99');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('createUser should return 201 on success', () => {
        const newUser = { id: 1, name: 'New User', email: 'new@user.com' };
        userService.createUser.mockReturnValue(newUser);

        const req = mockRequest({}, { name: 'New User', email: 'new@user.com' });
        userController.createUser(req, res);

        expect(userService.createUser).toHaveBeenCalledWith('New User', 'new@user.com');
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(newUser);
    });

    it('createUser should return 400 on error', () => {
        userService.createUser.mockImplementation(() => {
            throw new Error('Test Error');
        });

        const req = mockRequest({}, { name: 'Bad' });
        userController.createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Test Error' });
    });


    // ⬇️ ==========================================================
    // ⬇️ SMELL 2: CÓDIGO DUPLICADO (VIOLAÇÃO DO "DRY")
    // ⬇️ Este teste é quase idêntico ao 'createUser should return 201 on success'
    // ⬇️ SonarQube irá sinalizar "Duplicated blocks of code should be removed".
    // ⬇️ ==========================================================
    it('createUser should also return 201 on success with different data', () => {
        const newUser = { id: 2, name: 'Another User', email: 'another@user.com' };
        userService.createUser.mockReturnValue(newUser);

        const req = mockRequest({}, { name: 'Another User', email: 'another@user.com' });
        userController.createUser(req, res);

        expect(userService.createUser).toHaveBeenCalledWith('Another User', 'another@user.com');
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(newUser);
    });
    // ⬆️ ==========================================================
});