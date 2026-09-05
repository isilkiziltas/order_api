import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service.js';
import { catchAsync } from '../../../core/utils/catch-async.js';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = catchAsync(async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  });
}