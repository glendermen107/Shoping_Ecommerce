import { Controller, Get, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
    constructor(private readonly seedService: SeedService) { }

    @Get()
    async executeSeed() {
        return await this.seedService.runSeed();
    }

    @Delete()
    async clearDatabase() {
        return await this.seedService.clearDatabase();
    }

    @Get('reset')
    async resetDatabase() {
        await this.seedService.clearDatabase();
        return await this.seedService.runSeed();
    }
}
