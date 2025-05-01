import { RequestHandler } from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} from '../models/jobModel';

export const createJobHandler: RequestHandler = async (req, res, next) => {
  try {
    const { company_id, title, description, requirements, disability_filter } = req.body;
    const job = await createJob({ company_id, title, description, requirements, disability_filter });
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

export const listJobsHandler: RequestHandler = async (req, res, next) => {
  try {
    const jobs = await getAllJobs();
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

export const getJobHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const job = await getJobById(id);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    res.json(job);
  } catch (err) {
    next(err);
  }
};

export const updateJobHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const job = await updateJob(id, req.body);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    res.json(job);
  } catch (err) {
    next(err);
  }
};

export const deleteJobHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await deleteJob(id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
