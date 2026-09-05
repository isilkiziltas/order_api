import { Router } from 'express';
import { AuthController } from './controller/auth.controller.js';
import { AuthService } from './service/auth.service.js';
import { PrismaAuthRepository } from './repository/auth.repository.js';

const authRepository = new PrismaAuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

export const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);