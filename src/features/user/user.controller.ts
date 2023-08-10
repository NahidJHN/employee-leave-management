import { Controller, Post, Body, Get } from '@nestjs/common';
import { IProfile, UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthUser, IAuthUser, Public } from '../common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post("/admin/create")
  @Public()
  async createAdmin(@Body() createUserDto: CreateUserDto) {
    const admin = await this.userService.createAdmin(createUserDto)
    return { data: admin, message: "Admin created successfully" }
  }

  @Get("/profile")
  async getProfile(@AuthUser() authUser: IAuthUser): Promise<IProfile> {
    const profile = await this.userService.getProfile(authUser._id)
    return profile
  }

}
