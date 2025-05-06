import { RequestHandler } from 'express';
import {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole
} from '../models/rolesModel'

export const createRoleHandler: RequestHandler = async (req, res, next) => {
    try {
      const { name, description } = req.body; // Asegúrate de que `description` está incluido en el cuerpo de la solicitud
      const role = await createRole({ name, description });
      res.status(201).json(role);
    } catch (err) {
      next(err);
    }
  };

  export const listRolesHandler: RequestHandler = async (req, res, next) => {
    try {
      const roles = await getAllRoles();
      res.json(roles);
    } catch (err) {
      next(err);
    }
  };

export const getRoleHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const role = await getRoleById(id);
    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }
    res.json(role);
  } catch (err) {
    next(err);
  }
};

export const updateRoleHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const role = await updateRole(id, req.body);
    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }
    res.json(role);
  } catch (err) {
    next(err);
  }
};

export const deleteRoleHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const success = await deleteRole(id);
    if (!success) {
      res.status(404).json({ message: 'Role not found or could not be deleted' });
      return;
    }
    res.sendStatus(204); // No content, successful deletion
  } catch (err) {
    next(err);
  }
};
