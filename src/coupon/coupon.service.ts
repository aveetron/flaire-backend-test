import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Coupon } from "src/entities/Coupon";
import { Player } from "src/entities/Player";
import { PlayerCoupon } from "src/entities/PlayerCoupon";
import { Reward } from "src/entities/Reward";
import { Between, Equal, LessThan, LessThanOrEqual, Not, Repository } from "typeorm";

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(PlayerCoupon)
    private playerCouponRepository: Repository<PlayerCoupon>,
    @InjectRepository(Reward)
    private rewardRepository: Repository<Reward>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>
  ) { }

  async redeemCoupon(playerId, rewardId) {

    const currentDate = new Date();

    // check the rewardId valid or not
    let checkRewardExists = await this.rewardRepository.find({
      where: {
        id: rewardId,
        startDate: LessThan(currentDate),
        endDate: Not(LessThan(currentDate))
      }
    })

    if (!checkRewardExists) {
      return { message: 'reward doesnot exists' }
    }


    // get the coupon 
    let coupon = await this.couponRepository.findOne({
      where: {
        Reward: rewardId
      }
    })


    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // player cannot exceed per day limit
    let perDayLimitObj = await this.playerCouponRepository.find({
      where: {
        coupon: coupon,
        redeemedAt: Between(todayStart, todayEnd),
      }
    })
    let perDayLimit = perDayLimitObj.length;

    if (perDayLimit <= 3) {

      // player cannot exceed total limit
      let totalLimitObj = await this.playerCouponRepository.find({
        where: {
          coupon: coupon
        }
      })
      if (totalLimitObj.length <= 21) {
        // if this player already got this coupon this day
        let couponUsedByUser = await this.playerCouponRepository.find({
          where: {
            player: playerId,
            coupon: coupon,
            redeemedAt: Between(todayStart, todayEnd),
          }
        })
        if (couponUsedByUser.length >= 1) {
          return { message: "user already got this coupon" }
        }

        // save player coupon
        let playerCouponObj = {
          player: playerId,
          coupon: coupon,
          redeemAt: currentDate
        }
        let playerCoupon = await this.playerCouponRepository.save(playerCouponObj)
        return { id: playerCoupon.coupon.id, value: playerCoupon.coupon.value }
      }
      else {
        return { message: "total limit exceeded!" }
      }

    }
    else {
      return { message: "you already exceeded daily limit" }
    }


  }
}