export enum CATEGORY {
	EDUCATION,
	COLLECTION,
	CHALLENGE,
	LEGACY,
	length,
}

/*
/**
 * User achievements and whatever else related to using them.
 *
 * NOTE: Granted achievements are persisted for the user. They can only be removed by direct
 * user action.
 *
 * Achievements may be stacked together via the `previous` achievement DTO property which
 * refers to the previous achievement in the stack. The following rules apply to displaying
 * stacked achievements:
 *
 * - **if** previous achievement exists **and** was not completed, current achievement is
 * not displayed
 * - **if** previous achievement exists **and** was completed:
 * 	- only the latest completed achievement in the stack is displayed as completed
 * 	- only the first non-completed achievement in the stack is displayed as non-completed
 * 	- all completed achievements earlier in the stack are displayed inside the latest completed
 * 		achievement
 * 	- only the first incomplete achievements is displayed as incomplete
 * - **else**
 * 	- current achievement is displayed depending on its completion status
 *
namespace Achievement {
	/**
	 * Achievement subscriber is designed to track user progress in terms of the achievement
	 * as well as update/grant the achievement based of what the user has achieved.
	 *
	namespace Subscriber {
		/**
		 * Subscribe function params.
		 *
		 * @see {@link Ordo.Achievement.Subscriber.Fn}
		 *
		type Params = {
			/**
			 * Update the achievement content. Useful for multistep achievements. Accepts a callback
			 * that encloses previous achievement {@link DTO} state.
			 *
			update: (f: (prev_state: Ordo.Achievement.DTO) => Ordo.Achievement.DTO) => void

			/**
			 * Grant the achievement to the user. Should be called if the user has completed of the
			 * required criteria.
			 *
			grant: () => void
		}

		/**
		 * Subscribe function is called once the achievement is registerred. Inside
		 * the function, any subscriptions to commands (or other means of tracking user
		 * progress) may be added.
		 *
		 * @see {@link Ordo.Achievement.Subscriber.Params}
		 *
		type Fn = (params: Ordo.Achievement.Subscriber.Params) => void
	}

	/**
	 * Transferrable achievement object.
	 *
	type DTO = {
		/**
		 * Achievement identifier.
		 *
		 * @unique Subsequent achievements with the same `id` are not registerred (first in).
		 *
		id: string

		/**
		 * Translation key of the title of the achievement.
		 *
		 * @see {@link Ordo.I18N.TranslationKey}
		 *
		title: Ordo.I18N.TranslationKey

		/**
		 * URL of the achievement icon. Should be at least 200x200px.
		 *
		image: string

		/**
		 * Translation key of the description of the achievement. The description should give a
		 * hint on how to obtain the achievement.
		 *
		 * @see {@link Ordo.I18N.TranslationKey}
		 *
		description: Ordo.I18N.TranslationKey

		/**
		 * Achievement `id` of the previous achievement in an achievement stack.
		 *
		 * @see {@link Ordo.Achievement}
		 *
		previous?: string

		/**
		 * Achievement completion date. `null` means the achievement was not completed.
		 *
		completed_at: Date | null

		/**
		 * Achievement category.
		 *
		 * @see {@link AchievementCategory}
		 *
		category: C.ACHIEVEMENT_CATEGORY
	}

	/**
	 * Achievement object being registerred in Ordo.
	 *
	type Instance = {
		/**
		 * Transferrable achievement object.
		 *
		 * @see {@link DTO}
		 *
		descriptor: DTO

		/**
		 * Achievement progress subscriber. Registerred once when the achievement itself
		 * is registerred.
		 *
		 * @see {@link Ordo.Achievement.Subscriber}
		 *
		subscribe: Ordo.Achievement.Subscriber.Fn
	}
}
*/
