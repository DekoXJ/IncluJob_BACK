import { RequestHandler } from 'express';
import { createCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany } from '../models/companyModel';

export const createCompanyHandler: RequestHandler = async (req, res, next) => {
  try {
    const { name, description, owner_id } = req.body;  // Asegúrate de que owner_id esté en el cuerpo de la solicitud
    const company = await createCompany({ name, description, owner_id });
    res.status(201).json(company);  // Devuelve la respuesta directamente
  } catch (err) {
    next(err);  // Delega el manejo de errores al middleware de errores
  }
};

export const listCompaniesHandler: RequestHandler = async (req, res, next) => {
  try {
    const companies = await getAllCompanies();
    res.json(companies);
  } catch (err) {
    next(err);
  }
};

export const getCompanyHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const company = await getCompanyById(id);

    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    res.json(company);
  } catch (err) {
    next(err);
  }
};

export const updateCompanyHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const updated = await updateCompany(id, req.body);
    if (!updated) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteCompanyHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await deleteCompany(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
