import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { DoctorsService } from './doctors.service';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  findAll(
    @Query('departmentId') departmentId?: string,
    @Query('search') search?: string,
  ) {
    return this.doctorsService.findAll({ departmentId, search });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const doc = this.doctorsService.findById(id);
    if (!doc) {
      throw new NotFoundException(`Doctor with ID '${id}' not found`);
    }
    return doc;
  }

  @Get(':id/availability')
  getAvailability(
    @Param('id') id: string,
    @Query('date') date?: string,
  ) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const availability = this.doctorsService.getDoctorAvailability(id, targetDate);
    if (!availability) {
      throw new NotFoundException(`Doctor with ID '${id}' not found`);
    }
    return availability;
  }
}
