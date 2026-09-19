import { Request, Response } from "express";
import * as studentService from "../services/student.service";

export const joinClassController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { joinCode } = req.body;
    const studentId = (req as any).user?.id;

    if (!studentId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: Session not found",
      });
      return;
    }

    if (!joinCode || typeof joinCode !== "string" || joinCode.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Join code is required",
      });
      return;
    }

    // Find class
    const { data: classData, error: classError } = await studentService.getClassByJoinCode(
      joinCode.trim()
    );

    if (classError || !classData) {
      res.status(404).json({
        success: false,
        message: "Invalid join code. Class not found.",
      });
      return;
    }

    // Check duplicate enrollment
    const { data: existingEnrollment, error: checkError } = await studentService.checkEnrollment(
      classData.id,
      studentId
    );

    if (checkError) {
      res.status(500).json({
        success: false,
        message: checkError.message || "Failed to check enrollment status",
      });
      return;
    }

    if (existingEnrollment) {
      res.status(400).json({
        success: false,
        message: "You are already enrolled in this class.",
      });
      return;
    }

    // Enroll student
    const { error: enrollError } = await studentService.enrollStudentInClass(
      classData.id,
      studentId
    );

    if (enrollError) {
      res.status(500).json({
        success: false,
        message: enrollError.message || "Failed to enroll in class",
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Enrolled in class successfully",
      class: {
        id: classData.id,
        name: classData.name,
        description: classData.description,
      },
    });
  } catch (err: any) {
    console.error("Student join class error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export const getEnrolledClassesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const studentId = (req as any).user?.id;

    if (!studentId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { data, error } = await studentService.getEnrolledClassesByStudent(
      studentId
    );

    if (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve enrolled classes",
      });
      return;
    }

    // Map response structure to match existing conventions
    const formattedClasses = (data || []).map((membership: any) => ({
      joined_at: membership.joined_at,
      class: membership.classes,
    }));

    res.status(200).json({
      success: true,
      classes: formattedClasses,
    });
  } catch (err: any) {
    console.error("Get enrolled classes error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export const getEnrolledClassByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const studentId = (req as any).user?.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Class ID is required",
      });
      return;
    }

    if (!studentId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { data, error } = await studentService.getEnrolledClassById(
      id as string,
      studentId
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
      joined_at: (data as any).joined_at,
      class: (data as any).classes,
    });
  } catch (err: any) {
    console.error("Get enrolled class details error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};
