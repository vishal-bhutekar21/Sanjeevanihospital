import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ReviewsEventsService, ReviewStatus, EventStatus } from './reviews-events.service';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';

@Controller('reviews-events')
export class ReviewsEventsController {
  constructor(private readonly service: ReviewsEventsService) {}

  // ─── Public: Patient Reviews ──────────────────────────────────────────────

  @Public()
  @Get('reviews')
  getApprovedReviews() {
    return this.service.getApprovedReviews();
  }

  @Public()
  @Get('reviews/stats')
  getReviewStats() {
    return this.service.getReviewStats();
  }

  @Public()
  @Post('reviews/submit')
  @HttpCode(HttpStatus.CREATED)
  submitReview(@Body() dto: any) {
    return this.service.submitReview(dto);
  }

  @Public()
  @Patch('reviews/:id/helpful')
  markHelpful(@Param('id') id: string) {
    return this.service.markHelpful(id);
  }

  // ─── Public: Hospital Events ──────────────────────────────────────────────

  @Public()
  @Get('events')
  getUpcomingEvents() {
    return this.service.getUpcomingEvents();
  }

  @Public()
  @Get('events/all')
  getAllEvents(@Query('status') status?: EventStatus) {
    return this.service.getAllEvents(status);
  }

  // ─── Admin: Review Moderation ─────────────────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN)
  @Get('admin/reviews')
  getAllReviews(
    @Query('hospitalId') hospitalId?: string,
    @Query('status') status?: ReviewStatus,
  ) {
    return this.service.getAllReviews(hospitalId, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN)
  @Patch('admin/reviews/:id/moderate')
  moderateReview(
    @Param('id') id: string,
    @Body() body: { status: ReviewStatus; moderationNote?: string },
  ) {
    return this.service.moderateReview(id, body.status, body.moderationNote);
  }

  // ─── Admin: Event Management ──────────────────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN)
  @Post('admin/events')
  @HttpCode(HttpStatus.CREATED)
  createEvent(@Body() dto: any) {
    return this.service.createEvent(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN)
  @Patch('admin/events/:id/status')
  updateEventStatus(
    @Param('id') id: string,
    @Body() body: { status: EventStatus },
  ) {
    return this.service.updateEventStatus(id, body.status);
  }
}
