import { apiClient } from './apiClient';
import dayjs from 'dayjs';

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  preferredTime?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHabitData {
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  preferredTime?: string;
}

export interface CheckIn {
  id: string;
  habitId: string;
  status: 'completed' | 'pending' | 'skipped';
  date: string;
  notes?: string;
  createdAt: string;
}

export interface CreateCheckInData {
  status: 'completed' | 'skipped';
  date?: string; // ISO 8601 format (YYYY-MM-DD or full ISO string)
  notes?: string;
}

export interface CheckInStats {
  total: number;
  completed: number;
  skipped: number;
  pending: number;
  streak: number;
}

class HabitService {
  async getHabits(): Promise<Habit[]> {
    return apiClient.get('/habits');
  }

  async getHabit(habitId: string): Promise<Habit> {
    return apiClient.get(`/habits/${habitId}`);
  }

  async createHabit(data: CreateHabitData): Promise<Habit> {
    return apiClient.post('/habits', data);
  }

  async updateHabit(habitId: string, data: Partial<Habit>): Promise<Habit> {
    return apiClient.put(`/habits/${habitId}`, data);
  }

  async deleteHabit(habitId: string): Promise<void> {
    return apiClient.delete(`/habits/${habitId}`);
  }

  async createCheckIn(
    habitId: string,
    data: CreateCheckInData
  ): Promise<CheckIn> {
    // Adicionar data atual se não fornecida
    const checkInData = {
      ...data,
      date: data.date || dayjs().format('YYYY-MM-DD'),
    };
    return apiClient.post(`/habits/${habitId}/checkins`, checkInData);
  }

  async getCheckIns(habitId: string): Promise<CheckIn[]> {
    return apiClient.get(`/habits/${habitId}/checkins`);
  }

  async getCheckInsInRange(
    habitId: string,
    startDate: string,
    endDate: string
  ): Promise<CheckIn[]> {
    return apiClient.get(`/habits/${habitId}/checkins/range`, {
      params: {
        startDate,
        endDate,
      },
    });
  }

  async getCheckInStats(habitId: string): Promise<CheckInStats> {
    try {
      const checkIns = await this.getCheckIns(habitId);
      const stats: CheckInStats = {
        total: checkIns.length,
        completed: checkIns.filter((c) => c.status === 'completed').length,
        skipped: checkIns.filter((c) => c.status === 'skipped').length,
        pending: checkIns.filter((c) => c.status === 'pending').length,
        streak: this.calculateStreak(checkIns),
      };
      return stats;
    } catch (error) {
      console.error('Error calculating check-in stats:', error);
      return {
        total: 0,
        completed: 0,
        skipped: 0,
        pending: 0,
        streak: 0,
      };
    }
  }

  private calculateStreak(checkIns: CheckIn[]): number {
    if (checkIns.length === 0) return 0;

    const sorted = checkIns
      .sort((a, b) => dayjs(b.date).diff(dayjs(a.date)))
      .filter((c) => c.status === 'completed');

    if (sorted.length === 0) return 0;

    let streak = 0;
    let currentDate = dayjs();

    for (const checkIn of sorted) {
      if (dayjs(checkIn.date).isSame(currentDate, 'day')) {
        streak++;
        currentDate = currentDate.subtract(1, 'day');
      } else {
        break;
      }
    }

    return streak;
  }
}

export const habitService = new HabitService();
