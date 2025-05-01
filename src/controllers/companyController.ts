import { RequestHandler } from 'express';
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from '../models/companyModel';

export const createCompanyHandler: RequestHandler = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const company = await createCompany({ name, description });
    res.status(201).json(company);
  } catch (err) {
    next(err);
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
        return;       // ← devuelve void, no Response
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
