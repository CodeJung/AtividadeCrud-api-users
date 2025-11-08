// src/services/userService.js
const model = require('../models/userModel');

const getAllUsers = () => {
    return model.users;
};

const getUserById = (id) => {
    const userId = parseInt(id, 10);
    const user = model.users.find(u => u.id === userId);
    return user;
};

const createUser = (name, email) => {
    if (!name || !email) {
        throw new Error('Name and email are required');
    }
    const newUser = { id: model.nextId++, name, email };
    model.users.push(newUser);
    return newUser;
};

const updateUser = (id, name, email) => {
    const userId = parseInt(id, 10);
    const user = model.users.find(u => u.id === userId);

    if (!user) {
        return null; // Usuário não encontrado
    }

    user.name = name || user.name;
    user.email = email || user.email;
    return user;
};

const deleteUser = (id) => {
    const userId = parseInt(id, 10);
    const index = model.users.findIndex(u => u.id === userId);

    if (index === -1) {
        return false; // Não encontrado
    }

    model.users.splice(index, 1);
    return true; // Sucesso
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};