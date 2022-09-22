const { Base } = require("./base");
const { BaseRead } = require("./base-read");

class UserWrite extends Base {
  static get tableName() {
    return "visidata.user";
  }
}

class UserRead extends BaseRead {
  static get tableName() {
    return "visidata.user";
  }
}

module.exports = {
  UserWrite,
  UserRead,
};
