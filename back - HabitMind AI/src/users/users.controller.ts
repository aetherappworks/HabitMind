import { Controller, Get, Put, Body, UseGuards, Request, BadRequestException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UsersService } from './users.service';
import { UpdateUserDto, UserResponseDto, CreditsResponseDto } from './dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved',
    type: UserResponseDto,
  })
  async getProfile(@Request() req, @Query('lang') lang: string = 'pt-br') {
    try {
      return await this.usersService.getProfile(req.user.id, lang);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated',
    type: UserResponseDto,
  })
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
    @Query('lang') lang: string = 'pt-br',
  ) {
    try {
      return await this.usersService.updateProfile(req.user.id, updateUserDto, lang);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('credits')
  @ApiOperation({ summary: 'Get available credits' })
  @ApiResponse({
    status: 200,
    description: 'User credits retrieved',
    type: CreditsResponseDto,
  })
  async getCredits(@Request() req, @Query('lang') lang: string = 'pt-br') {
    try {
      return await this.usersService.getCredits(req.user.id, lang);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
