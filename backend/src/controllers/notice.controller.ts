import { Request, Response } from "express";
import * as noticeService from "../services/notice.service";
import * as classService from "../services/class.service";

export const createNoticeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, message } = req.body;
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
        message: "Unauthorized: User session not found",
      });
      return;
    }

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Notice title is required and cannot be empty",
      });
      return;
    }

    if (title.trim().length > 150) {
      res.status(400).json({
        success: false,
        message: "Notice title cannot be longer than 150 characters",
      });
      return;
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Notice message is required and cannot be empty",
      });
      return;
    }

    if (message.trim().length > 2000) {
      res.status(400).json({
        success: false,
        message: "Notice message cannot be longer than 2000 characters",
      });
      return;
    }

    // Verify the teacher owns the class before posting a notice to it
    const { data: classData, error: classError } =
      await classService.getClassByIdAndTeacher(id as string, teacherId);

    if (classError || !classData) {
      res.status(404).json({
        success: false,
        message: "Class not found or access denied",
      });
      return;
    }

    const { data, error } = await noticeService.createNotice(
      { title, message },
      id as string,
      teacherId
    );

    if (error || !data || data.length === 0) {
      res.status(500).json({
        success: false,
        message: error?.message || "Failed to create notice record",
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Notice posted successfully",
      notice: data[0],
    });
  } catch (err: any) {
    console.error("Create notice error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export const getNoticesForClassController = async (
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

    const { data: classData, error: classError } =
      await classService.getClassByIdAndTeacher(id as string, teacherId);

    if (classError || !classData) {
      res.status(404).json({
        success: false,
        message: "Class not found or access denied",
      });
      return;
    }

    const { data, error } = await noticeService.getNoticesByClassAndTeacher(
      id as string,
      teacherId
    );

    if (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve notices",
      });
      return;
    }

    res.status(200).json({
      success: true,
      notices: data || [],
    });
  } catch (err: any) {
    console.error("Get class notices error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export const getStudentNoticesController = async (
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

    const { data, error } = await noticeService.getNoticesForStudent(studentId);

    if (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve notices",
      });
      return;
    }

    // Map response structure to match existing conventions
    const formattedNotices = (data || []).map((recipient: any) => ({
      id: recipient.id,
      is_read: recipient.is_read,
      delivered_at: recipient.delivered_at,
      read_at: recipient.read_at,
      notice: recipient.notices,
    }));

    res.status(200).json({
      success: true,
      notices: formattedNotices,
    });
  } catch (err: any) {
    console.error("Get student notices error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export const markNoticeReadController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const studentId = (req as any).user?.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Notice ID is required",
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

    const { data, error } = await noticeService.markNoticeAsRead(
      id as string,
      studentId
    );

    if (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to mark notice as read",
      });
      return;
    }

    if (!data || data.length === 0) {
      res.status(404).json({
        success: false,
        message: "Notice not found or access denied",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Notice marked as read",
      recipient: data[0],
    });
  } catch (err: any) {
    console.error("Mark notice read error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};
