import { RequestHandler } from 'express';
import {
  createApplication,
  getApplicationsByUser,
  getApplicationsByJob,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
} from '../models/applicationModel';
import { AuthRequest } from '../middleware/auth';

export const applyJobHandler: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const user_id = req.userId!;
    const { job_id } = req.body;
    const application = await createApplication({ user_id, job_id });
    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
};

export const listMyApplicationsHandler: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const user_id = req.userId!;
    const apps = await getApplicationsByUser(user_id);
    res.json(apps);
  } catch (err) {
    next(err);
  }
};

export const listApplicationsByJobHandler: RequestHandler = async (req, res, next) => {
  try {
    const job_id = Number(req.params.jobId);
    const apps = await getApplicationsByJob(job_id);
    res.json(apps);
  } catch (err) {
    next(err);
  }
};

export const getApplicationHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const app = await getApplicationById(id);
    if (!app) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }
    res.json(app);
  } catch (err) {
    next(err);
  }
};

export const updateApplicationHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const app = await updateApplicationStatus(id, status);
    if (!app) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }
    res.json(app);
  } catch (err) {
    next(err);
  }
};

export const deleteApplicationHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await deleteApplication(id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
