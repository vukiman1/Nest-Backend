import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log(createUserDto);
    const userName = createUserDto.userName;
    const email = createUserDto.email;
    // if user already exist
    const isUserExist = await this.userRepository.findOne({
      where: { userName },
    });
    if (isUserExist) {
      throw new BadRequestException('User already exist');
    }

    // if email already exists
    const isEmailExist = await this.userRepository.findOne({
      where: { email },
    });
    if (isEmailExist) {
      throw new BadRequestException('Email already exist');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.passWord, salt);

    createUserDto.passWord = hashedPassword;

    const newuser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newuser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  @UseGuards(JwtAuthGuard)
  @UseGuards(AuthGuard('local'))
  async findOne(id: number): Promise<User> {
    const isUserExist = await this.userRepository.findOne({
      where: { id },
    });

    if (!isUserExist) {
      throw new BadRequestException('User not exist');
    }
    console.log(isUserExist);

    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(updateUserDto.passWord, salt);

    updateUserDto.passWord = hashedPassword;

    await this.userRepository.update(id, updateUserDto);

    return this.userRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  findUser(userName: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        userName,
      },
    });
  }
}
