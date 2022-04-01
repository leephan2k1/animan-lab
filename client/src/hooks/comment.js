import repositoryFactory from "@/api/repositoryFactory";
const commentRepo = repositoryFactory.get("comments");

import { useStore } from "vuex";

export default function () {
  const store = useStore();

  const create = async (content, postSlug) => {
    console.log({ content, postSlug });
    try {
      const res = await commentRepo.createComment({ content, postSlug });
      if (res?.data.success) {
        return true; 
      }
    } catch (err) {
      console.log(err);
    }
  };

  return { create };
}
