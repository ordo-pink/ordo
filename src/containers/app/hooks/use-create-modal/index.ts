import {
  showCreateDirectoryModal,
  showCreateFileModal,
} from "$containers/app/hooks/use-create-modal/store"

export const useCreateModal = () => ({
  showCreateDirectoryModal,
  showCreateFileModal,
})
