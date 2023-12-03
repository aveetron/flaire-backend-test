import { Body, Controller, Post } from "@nestjs/common";
import { CouponService } from "./coupon.service";
import { Request } from "express";

@Controller()
export class CouponController {
  constructor(private couponService: CouponService) { }

  @Post('coupon-redeem')
  public async couponRedeem(@Body() req: { playerId: number, rewardId: number }): Promise<any> {
    return this.couponService.redeemCoupon(req.playerId, req.rewardId)
  }
}