import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerCoupon } from 'src/entities/PlayerCoupon';
import { Reward } from 'src/entities/Reward';
import { Player } from 'src/entities/Player';
import { Coupon } from 'src/entities/Coupon';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerCoupon, Reward, Player, Coupon])],
  controllers: [CouponController],
  providers: [CouponService],
})

export class CouponModule { }
