import express, { request, response } from "express";
import { celebrate, Joi } from "celebrate";

import multer from "multer";
import multerConfig from "./config/multer";

import ProfilesController from "./controllers/ProfilesController";
import MoodsController from "./controllers/MoodsController";

const routes = express.Router();
const upload = multer(multerConfig);

const profilesController = new ProfilesController();
const moodsController = new MoodsController();

routes.get("/", (request, response) => {
  return response.json({ message: "asd" });
});

routes.get("/moods", moodsController.index);
routes.get("/profiles", profilesController.index);
routes.get("/profiles/:id", profilesController.show);

routes.post(
  "/profiles",
  upload.single("image"),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        nickname: Joi.string().required(),
        gender: Joi.string().required(),
        orientation: Joi.string().required(),
        whatsapp: Joi.number().required(),
        lat: Joi.number().required(),
        long: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        spotify_uri: Joi.string().required(),
        moods: Joi.string().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  profilesController.create
);

export default routes;
