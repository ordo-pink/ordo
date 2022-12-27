import {
  showDeleteDirectoryModal,
  showDeleteFileModal,
} from "$containers/app/hooks/use-delete-modal/store"

export const useDeleteModal = () => ({
  showDeleteFileModal,
  showDeleteDirectoryModal,
})
