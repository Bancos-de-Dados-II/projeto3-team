import { Router } from "express";
import { registerUserController } from "../controllers/user/register-user.controller";
import { login } from "../controllers/user/login.controller";
import { listUsersController } from "../controllers/user/list-users.controller";
import { validateEmailUser } from "../middlewares/user/validate-email";
import { authenticateToken } from "../middlewares/user/authenticate-token";

const router = Router();
router.post("/register", validateEmailUser, registerUserController);
router.post("/login", login);
router.get("/", listUsersController);

//para teste
//router.get("/users", listUsersController); 
//router.delete("/users/:id", deleteUserController);
//router.patch("/users/:id/role", updateRoleUserController);


export default router;