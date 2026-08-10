import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  status?: number;
  code?: string;
}

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const handleSuccess = (res: Response, data: any, message?: string) => {
  res.json({ success: true, data, message: message || '操作成功' });
};
