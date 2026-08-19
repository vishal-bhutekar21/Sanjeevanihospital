import { Module } from '@nestjs/common';
import { ReviewsEventsService } from './reviews-events.service';
import { ReviewsEventsController } from './reviews-events.controller';

@Module({
  controllers: [ReviewsEventsController],
  providers: [ReviewsEventsService],
  exports: [ReviewsEventsService],
})
export class ReviewsEventsModule {}
