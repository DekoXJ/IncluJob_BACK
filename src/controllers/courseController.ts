import { RequestHandler } from 'express';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from '../models/courseModel';

export const createCourseHandler: RequestHandler = async (req, res, next) => {
  try {
    const { title, description, type, resource_url } = req.body;
    const course = await createCourse({ title, description, type, resource_url });
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

export const listCoursesHandler: RequestHandler = async (req, res, next) => {
  try {
    const courses = await getAllCourses();
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

export const getCourseHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const course = await getCourseById(id);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    res.json(course);
  } catch (err) {
    next(err);
  }
};

export const updateCourseHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const course = await updateCourse(id, req.body);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    res.json(course);
  } catch (err) {
    next(err);
  }
};

export const deleteCourseHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await deleteCourse(id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
