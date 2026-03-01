import { MemoryModel } from "../../../../shared/models/memory.model.js";

export async function mongoDBMemoryDeletion(memoryId) {
  const deletion = await MemoryModel.findByIdAndDelete({ _id: memoryId });

  return deletion;
}
