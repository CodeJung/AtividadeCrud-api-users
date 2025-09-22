const { getAllUsers, saveUsers } = require('../models/UserModel');

// Função para obter todos os usuários
const listUsers = () => {
    return getAllUsers();
};

// Função para obter um usuário por ID
const getUserById = (id) => {
    const users = getAllUsers();
    return users.find(user => user.id === id);
};

// Função para criar um novo usuário
const createUser = (userData) => {
    const users = getAllUsers();
    const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
    const newUser = { id: newId, ...userData };
    users.push(newUser);
    saveUsers(users);
    return newUser;
};

// Função para atualizar um usuário
const updateUser = (id, updatedData) => {
    const users = getAllUsers();
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) throw new Error('Usuário não encontrado.');
    users[userIndex] = { ...users[userIndex], ...updatedData };
    saveUsers(users);
    return users[userIndex];
};

// Função para deletar um usuário
const deleteUser = (id) => {
    const users = getAllUsers();
    const updatedUsers = users.filter(user => user.id !== id);
    if (users.length === updatedUsers.length) throw new Error('Usuário não encontrado.');
    saveUsers(updatedUsers);
};

module.exports = { listUsers, getUserById, createUser, updateUser, deleteUser };