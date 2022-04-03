import repositoryFactory from "@/api/repositoryFactory";
const commentRepo = repositoryFactory.get("comments");

export default function () {
  const create = async (content, postSlug) => { 
    try {
      const res = await commentRepo.createComment({ content, postSlug });
      if (res?.data.success) {
        return true;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAll = async (params) => { 
    try {
      const res = await commentRepo.getComments(params);
      if (res?.data.success) { 
        return res.data?.comments;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return { create, getAll };
}
