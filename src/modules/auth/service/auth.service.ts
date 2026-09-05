import bcrypt from 'bcrypt';
import { IAuthRepository } from '../repository/auth.repository.js';
import { RegisterDTO, LoginDTO, AuthResponseDTO } from '../dtos/auth.dto.js';
import { AppError } from '../../../core/app-error.js';
import { generateToken } from '../../../core/utils/jwt.util.js';

export class AuthService {
  constructor(private readonly authRepository: IAuthRepository) {}

  async register(dto: RegisterDTO): Promise<AuthResponseDTO> {
    const existingUser = await this.authRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new AppError('Bu e-posta adresi zaten kullanımda.', 409);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    const newUser = await this.authRepository.create({
      email: dto.email,
      password: hashedPassword,
    });

    const token = generateToken({ userId: newUser.id, role: newUser.role });

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    };
  }

  async login(dto: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.authRepository.findByEmail(dto.email);
    if (!user) {
      throw new AppError('Geçersiz e-posta veya şifre.', 401);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Geçersiz e-posta veya şifre.', 401);
    }

    const token = generateToken({ userId: user.id, role: user.role });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}