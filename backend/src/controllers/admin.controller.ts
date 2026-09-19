import { Request, Response  } from "express";
import { getUsers, createUserByAdmin, removeUser , updateUser } from "../services/admin.service";

export const getAllUserController = async(
    req: Request,
    res: Response,
): Promise<void>=>{
    const result = await getUsers();
    res.status(200).json(result);
};

export const createUserController = async(
    req:Request,
    res:Response,
): Promise<void> => {
    const {name, email,role} = req.body;
    const result = await createUserByAdmin(name,email,role);
    res.status(201).json(result)
}

export const deleteUserController = async (
  req: Request,
  res: Response
): Promise<void> => {

  const id = req.params.id;

  if (!id) {
    res.status(400).json({
      success: false,
      message: "Id is required",
    });
    return;
  }

  const result = await removeUser(id as string);

  res.status(200).json(result);
};

export const updateUserController = async(
  req:Request,
  res:Response,
): Promise<void> => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({
      success: false,
      message: "Id is required",
    });
    return;
  }
  const result = await updateUser(id as string , req.body );
  res.status(200).json(result)
}

