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

  const update = async (id, content) => {
    try {
      const res = await commentRepo.updateComment(id, { content });
      if (res?.data.success) {
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
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

  const like = async (id) => {
    try {
      const res = await commentRepo.likeComment({ id });
      if (res?.data.success) {
        return true;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const unLike = async (id) => {
    try {
      const res = await commentRepo.unLikeComment({ id });
      if (res?.data.success) {
        return true;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  return { create, getAll, like, unLike, update };
}
