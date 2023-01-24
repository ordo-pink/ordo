import { useNavigate } from "react-router-dom"

import { useEnv } from "$core/hooks/use-env"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useState } from "$core/state/hooks/use-state"
import { ActionContext } from "$core/types"

export const useActionContext = (
  contextMenuTarget: ActionContext["contextMenuTarget"] = null,
): ActionContext => {
  const dispatch = useAppDispatch()
  const state = useState()
  const env = useEnv()
  const navigate = useNavigate()

  return {
    dispatch,
    env,
    state,
    contextMenuTarget,
    navigate,
  }
}
