import { Router } from "express";
import { createInstitutionController } from "../controllers/institution/create-institution.controller";
import { deleteInstitutionController } from "../controllers/institution/delete-institution.controller";
import { getInstitutionController } from "../controllers/institution/get-institution.controller";
// import { getIdInstitutionController } from "../controllers/institution/get-id-institution.controller";
import { updateInstitutionController } from "../controllers/institution/update-institution.controller";
import { updateLocalizationInstitutionController } from "../controllers/institution/update-localization-institution.controller";
import { validateCnpj } from "../middlewares/institution/validate-cnpj";
import { validateId } from "../middlewares/institution/validateId";
import { authenticateToken } from "../middlewares/user/authenticate-token";

const router = Router();

router.post("/", authenticateToken, validateCnpj, createInstitutionController);
router.delete("/:id", authenticateToken, validateId, deleteInstitutionController);
router.get("/", getInstitutionController);
// router.get("/:id", validateId, getIdInstitutionController);
router.put("/:id", validateId, updateInstitutionController)
router.patch("/:id", validateId, updateLocalizationInstitutionController);

export default router;