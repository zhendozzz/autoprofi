const fs = require("fs");

class UsersService {
  getUsers() {
    return new Promise((res, rej) => {
      fs.readFile("./users.json", (err, data) => {
        if (err) {
          return res(false);
        }
        return res(JSON.parse(data));
      });
    });
  }

  createUser(data) {
    return new Promise((res, rej) => {
      fs.writeFile("data.json", JSON.stringify(data), (err, response) => {
        if (err) return res(false);

        return res({ message: "User created." });
      });
    });
  }

  updateUser(data) {
    return new Promise((res, rej) => {
      fs.writeFile("data.json", JSON.stringify(data), (err, response) => {
        if (err) return res(false);

        return res({ message: "User updated." });
      });
    });
  }

  deleteUser(data) {
    return new Promise((res, rej) => {
      fs.writeFile("data.json", JSON.stringify(data), (err, response) => {
        if (err) return res(false);

        return res({ message: "User deleted." });
      });
    });
  }
}

module.exports = new UsersService();
