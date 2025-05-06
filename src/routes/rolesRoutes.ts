import { Router } from 'express';
import {
  createRoleHandler,
  listRolesHandler,
  getRoleHandler,
  updateRoleHandler,
  deleteRoleHandler
} from '../controllers/rolesController';

const rolesRouter = Router();

rolesRouter.post('/', createRoleHandler);

rolesRouter.get('/', listRolesHandler);

rolesRouter.get('/:id', getRoleHandler);

rolesRouter.put('/:id', updateRoleHandler);

rolesRouter.delete('/:id', deleteRoleHandler);

export default rolesRouter;
