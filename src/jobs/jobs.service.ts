import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(private readonly httpService: HttpService) {}

  //make a request to my chat server in every 29 min for keep alive
  @Cron('*/10 * * * *')
  async handleCron() {
    try {
      const data = await this.httpService.axiosRef.get(
        'https://chat-app-sn3m.onrender.com/api/v1/users/health',
      );
      console.log(data.data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
