const express = require("express");

const UserController = require("../../handlers/v2/user");

const router = express.Router();
const { authentication } = require("../../middlewares/auth");

router.get(
  "/user/all",
  UserController.allHandler
);
// router.get(
//   "/data-klinik/:idDataKlinik/:idUser/user/all",
//   UserController.findByIdHandler
// );
router.post(
  "/user/create",
  UserController.createHandler
);
// router.patch(
//   "/data-klinik/:idDataKlinik/user/all/:idUser",
//   UserController.updateHandler
// );
// router.patch(
//   "/data-klinik/:idDataKlinik/user/all/:idUser/hide",
//   UserController.hideHandler
// );
// router.patch(
//   "/data-klinik/:idDataKlinik/user/all/:idUser/unhide",
//   UserController.unhideHandler
// );
module.exports = router;
