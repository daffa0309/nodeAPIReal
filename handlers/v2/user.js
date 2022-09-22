const { get, post, patch } = require(".");
const {
  UserWrite,
  UserRead,
} = require("../../models/v2/user");
const {
  prepareObjectAsAPIResponse,
  transformAttributesToPascalCase,
} = require("../../utils/object");

async function all(...args) {

  let user = await UserRead.all(
    undefined,
    {
      visible: 1,
    },
    undefined,
    undefined
  );

  if (user.length === 0) {
    return null;
  }

  user = user.map((val) => {
    return prepareObjectAsAPIResponse(val, "VISIBLE");
  });

  return {
    user,
  };
}

async function findById(...args) {
  const params = args[0];
  const { idUser, idDataKlinik } = params;

  let user = await UserRead.all(
    undefined,
    {
      ID_KATEGORI_MAINTENANCE: idUser,
      visible: 1,
    },
    undefined,
    undefined
  );

  if (user.length === 0) {
    return null;
  }

  user = user.map((val) => {
    return prepareObjectAsAPIResponse(val, "VISIBLE");
  });

  return {
    user,
  };
}

async function create(...args) {
  const body = args[2];


  let attributes = {
    ...body,
  };

  console.log(attributes);

  await UserWrite.create(attributes);
}

async function update(...args) {
  const params = args[0];
  const body = args[2];

  const { idUser, idDataKlinik } = params;

  let attributes = {
    ...body,
  };

  attributes = transformAttributesToPascalCase(attributes);

  await UserWrite.update(
    {
      ID_KATEGORI_MAINTENANCE: idUser,
    },
    attributes
  );
}
async function hide(...args) {
  const params = args[0];
  const { idUser, idDataKlinik } = params;

  await UserWrite.hide({
    ID_KATEGORI_MAINTENANCE: idUser
  });
}

async function unhide(...args) {
  const params = args[0];
  const { idUser, idDataKlinik } = params;

  await UserWrite.unhide({
    ID_KATEGORI_MAINTENANCE: idUser
  });
}

const allHandler = get(all, ["params"]);
const findByIdHandler = get(findById, ["params"]);
const createHandler = post(create, "params", "body");
const updateHandler = patch(update, "params", "body");
const hideHandler = patch(hide, "params");
const unhideHandler = patch(unhide, "params");
module.exports = {
  allHandler,
  findByIdHandler,
  createHandler,
  updateHandler,
  hideHandler,
  unhideHandler,
};
