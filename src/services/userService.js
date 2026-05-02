const users = {};

function addUser(socket, username) {
    user[socketId] = username;
}

function removeUser(socketId) {
    const username = users[socketId];
    delete users[socketId];
    return username;
}

function getUser(socketId){
    return users[socketId];
}

function getUserByName(username){
    return Object.keys(users).find(
        (id) => users[id] === username
    );
}

function getAllUsers() {
    return Object.values(users);
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserByName,
    getAllUsers,
}