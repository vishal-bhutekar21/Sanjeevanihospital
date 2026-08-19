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
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { SchemesService, SchemeType, ClaimStatus } from './schemes.service';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';

@Controller('schemes')
export class SchemesController {
  constructor(private readonly schemesService: SchemesService) {}

  // ─── Public Informational Endpoints ───────────────────────────────────────

  @Public()
  @Get('mjpjay/info')
  getMjpjayInfo() {
    return this.schemesService.getMjpjayProcedures();
  }

  @Public()
  @Get('insurance/info')
  getInsuranceInfo() {
    return this.schemesService.getInsuranceInfo();
  }

  // ─── Patient-Facing Claim Registration ────────────────────────────────────

  @Public()
  @Post('claims/register')
  @HttpCode(HttpStatus.CREATED)
  registerClaim(@Body() dto: any) {
    return this.schemesService.registerClaim(dto);
  }

  // ─── Admin-Protected Claim Management ────────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN)
  @Get('claims')
  getAllClaims(
    @Query('hospitalId') hospitalId?: string,
    @Query('schemeType') schemeType?: SchemeType,
  ) {
    return this.schemesService.getAllClaims(hospitalId, schemeType);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN)
  @Get('stats')
  getStats() {
    return this.schemesService.getStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN)
  @Patch('claims/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: ClaimStatus; remarks?: string; preAuthorizationId?: string },
  ) {
    return this.schemesService.updateClaimStatus(id, body.status, body.remarks, body.preAuthorizationId);
  }
}
