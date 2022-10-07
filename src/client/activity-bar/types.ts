import type { IconName } from "@client/use-icon"

type ActivityID = string

/**
 * Application activity
 */
export type Activity = {
  /**
   * Unique activity identifier.
   */
  name: ActivityID

  /**
   * Activity icon (can be selected from the provided list).
   */
  icon: IconName
}
