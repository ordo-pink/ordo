import { GlobalStatsDTO, GlobalStatsDriver } from "@ordo-pink/common-types"

export class GlobalStatsService {
  public static of(statsDriver: GlobalStatsDriver): GlobalStatsService {
    return new GlobalStatsService(statsDriver)
  }

  #statsDriver: GlobalStatsDriver

  protected constructor(statsDriver: GlobalStatsDriver) {
    this.#statsDriver = statsDriver
  }

  public async increment(record: keyof GlobalStatsDTO) {
    return this.#statsDriver.increment(record)
  }

  public async decrement(record: keyof GlobalStatsDTO) {
    return this.#statsDriver.decrement(record)
  }
}
