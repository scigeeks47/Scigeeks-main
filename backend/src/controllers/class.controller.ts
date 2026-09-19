import { Request, Response } from "express";
import * as classService from "../services/class.service";

export const createClassController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;
    const teacherId = (req as any).user?.id;

    if (!teacherId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User session not found",
      });
      return;
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Class name is required and cannot be empty",
      });
      return;
    }

    if (name.trim().length > 100) {
      res.status(400).json({
        success: false,
        message: "Class name cannot be longer than 100 characters",
      });
      return;
    }

    if (description && (typeof description !== "string" || description.trim().length > 500)) {
      res.status(400).json({
        success: false,
        message: "Description cannot be longer than 500 characters",
      });
      return;
    }

    const { data, error } = await classService.createClass(
      { name, description },
      teacherId
    );

    if (error || !data || data.length === 0) {
      res.status(500).json({
        success: false,
        message: error?.message || "Failed to create class record",
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      class: data[0],
    });
  } catch (err: any) {
    console.error("Create class error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export const getClassesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const teacherId = (req as any).user?.id;

    if (!teacherId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { data, error } = await classService.getClassesByTeacher(teacherId);

    if (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve classes",
      });
      return;
    }

    res.status(200).json({
      success: true,
      classes: data || [],
    });
  } catch (err: any) {
    console.error("Get classes error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export const getClassByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const teacherId = (req as any).user?.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Class ID is required",
      });
      return;
    }

    if (!teacherId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { data, error } = await classService.getClassByIdAndTeacher(
      id as string,
      teacherId
    );

    if (error || !data) {
      res.status(404).json({
        success: false,
        message: "Class not found or access denied",
      });
      return;
    }

    res.status(200).json({
      success: true,
      class: data,
    });
  } catch (err: any) {
    console.error("Get class by ID error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export const deleteClassController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const teacherId = (req as any).user?.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Class ID is required",
      });
      return;
    }

    if (!teacherId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { data, error } = await classService.deleteClassByIdAndTeacher(
      id as string,
      teacherId
    );

    if (error || !data || data.length === 0) {
      res.status(404).json({
        success: false,
        message: "Class not found or access denied",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (err: any) {
    console.error("Delete class error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};
