import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { DepartmentsService } from './departments.service';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    const dept = this.departmentsService.findBySlug(slug);
    if (!dept) {
      throw new NotFoundException(`Department '${slug}' not found`);
    }
    return dept;
  }
}
