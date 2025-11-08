// src/services/userService.test.js
const userService = require('./userService');
const model = require('../models/userModel');

// Resetar os dados do "banco de dados" em memória antes de cada teste
beforeEach(() => {
    model.users.length = 0; // Limpa o array
    model.users.push(
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' }
    );
    model.nextId = 3;
});

describe('UserService', () => {

    it('should get all users', () => {
        const users = userService.getAllUsers();
        expect(users).toHaveLength(2);
        expect(users[0].name).toBe('Alice');
    });

    it('should get a user by id', () => {
        const user = userService.getUserById(1);
        expect(user).toBeDefined();
        expect(user.name).toBe('Alice');
    });

    it('should return undefined for a non-existent user id', () => {
        const user = userService.getUserById(99);
        expect(user).toBeUndefined();
    });

    it('should create a new user', () => {
        const newUser = userService.createUser('Charlie', 'charlie@example.com');
        expect(newUser).toBeDefined();
        expect(newUser.id).toBe(3);
        expect(newUser.name).toBe('Charlie');
        
        const users = userService.getAllUsers();
        expect(users).toHaveLength(3);
    });

    it('should throw an error if name or email is missing on create', () => {
        expect(() => userService.createUser('JustName', null)).toThrow('Name and email are required');
    });

    it('should update a user', () => {
        const updatedUser = userService.updateUser(1, 'Alice V2', 'alice_v2@example.com');
        expect(updatedUser.name).toBe('Alice V2');
        expect(updatedUser.email).toBe('alice_v2@example.com');
    });

    it('should return null when updating a non-existent user', () => {
        const updatedUser = userService.updateUser(99, 'Ghost', 'ghost@example.com');
        expect(updatedUser).toBeNull();
    });

    it('should delete a user', () => {
        const success = userService.deleteUser(1);
        expect(success).toBe(true);
        const users = userService.getAllUsers();
        expect(users).toHaveLength(1);
        expect(users[0].name).toBe('Bob');
    });

    it('should return false when deleting a non-existent user', () => {
        const success = userService.deleteUser(99);
        expect(success).toBe(false);
    });
});