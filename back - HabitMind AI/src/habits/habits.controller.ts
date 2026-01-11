import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { HabitsService } from './habits.service';
import { CreateHabitDto, UpdateHabitDto, HabitResponseDto } from './dto/habit.dto';
import { CreateCheckinDto, HabitLogResponseDto } from './dto/checkin.dto';

@ApiTags('Habits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('habits')
export class HabitsController {
  constructor(private habitsService: HabitsService) {}

  // ============ Habits Endpoints ============

  @Post()
  @ApiOperation({ summary: 'Create a new habit' })
  @ApiResponse({
    status: 201,
    description: 'Habit created',
    type: HabitResponseDto,
  })
  async createHabit(
    @Request() req,
    @Body() createHabitDto: CreateHabitDto,
    @Query('lang') lang: string = 'pt-br',
  ) {
    try {
      return await this.habitsService.createHabit(req.user.id, createHabitDto, lang);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all user habits' })
  @ApiResponse({
    status: 200,
    description: 'List of habits',
    type: [HabitResponseDto],
  })
  async getHabits(@Request() req, @Query('lang') lang: string = 'pt-br') {
    try {
      return await this.habitsService.getHabits(req.user.id, lang);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific habit' })
  @ApiResponse({
    status: 200,
    description: 'Habit details',
    type: HabitResponseDto,
  })
  async getHabit(
    @Param('id') habitId: string,
    @Request() req,
    @Query('lang') lang: string = 'pt-br',
  ) {
    try {
      return await this.habitsService.getHabit(habitId, req.user.id, lang);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a habit' })
  @ApiResponse({
    status: 200,
    description: 'Habit updated',
    type: HabitResponseDto,
  })
  async updateHabit(
    @Param('id') habitId: string,
    @Request() req,
    @Body() updateHabitDto: UpdateHabitDto,
    @Query('lang') lang: string = 'pt-br',
  ) {
    try {
      return await this.habitsService.updateHabit(habitId, req.user.id, updateHabitDto, lang);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a habit' })
  @ApiResponse({
    status: 200,
    description: 'Habit deleted',
  })
  async deleteHabit(
    @Param('id') habitId: string,
    @Request() req,
    @Query('lang') lang: string = 'pt-br',
  ) {
    try {
      return await this.habitsService.deleteHabit(habitId, req.user.id, lang);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ============ Check-ins Endpoints ============

  @Post(':id/checkins')
  @ApiTags('Check-ins')
  @ApiOperation({ summary: 'Create a check-in for a habit' })
  @ApiResponse({
    status: 201,
    description: 'Check-in created',
    type: HabitLogResponseDto,
  })
  async createCheckin(
    @Param('id') habitId: string,
    @Request() req,
    @Body() createCheckinDto: CreateCheckinDto,
    @Query('lang') lang: string = 'pt-br',
  ) {
    try {
      return await this.habitsService.createCheckin(habitId, req.user.id, createCheckinDto, lang);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id/checkins')
  @ApiTags('Check-ins')
  @ApiOperation({ summary: 'Get all check-ins for a habit' })
  @ApiResponse({
    status: 200,
    description: 'List of check-ins',
    type: [HabitLogResponseDto],
  })
  async getCheckins(
    @Param('id') habitId: string,
    @Request() req,
    @Query('lang') lang: string = 'pt-br',
  ) {
    try {
      return await this.habitsService.getCheckins(habitId, req.user.id, lang);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id/checkins/range')
  @ApiTags('Check-ins')
  @ApiOperation({ summary: 'Get check-ins for a habit in a date range' })
  @ApiResponse({
    status: 200,
    description: 'List of check-ins in date range',
    type: [HabitLogResponseDto],
  })
  async getCheckinsByDateRange(
    @Param('id') habitId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req,
    @Query('lang') lang: string = 'pt-br',
  ) {
    try {
      return await this.habitsService.getCheckinsByDateRange(
        habitId,
        req.user.id,
        startDate,
        endDate,
        lang,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
