import repositoryFactory from "@/api/repositoryFactory";
const postRepository = repositoryFactory.get("posts");
const userRepository = repositoryFactory.get("users");

import { useRouter } from "vue-router";
import { useStore } from "vuex";

import { USER_UPDATE } from "@/constants";

export default function () {
  const router = useRouter();
  const store = useStore();

  const deletePost = async (slug) => {
    if (window.confirm("Chắc chứ bạn?")) {
      if (window.confirm("Vẫn là chắc chứ? nhưng nó là lần 2 🤡")) {
        if (
          window.confirm(
            "Tôi nghĩ bạn không chắc lắm, lần cuối nào, chắc không 🐧?"
          )
        ) {
          try {
            const res = await postRepository.deletePost({
              slug,
            });
            if (res?.data.success) {
              window.alert("Xoá thành công!");
              router.push({ name: "home" });
            }
          } catch (err) {
            console.error(err);
          }
        }
      }
    }
  };

  const likePost = async (isLiked, profile, user_name, id) => {
    if (user_name === "") {
      user_name = profile?.user_name;
    }
    try {
      //add like post
      const res = await userRepository.addLikePost(user_name, { id });
      //if like api failed => reverse state
      if (!res?.data.success) {
        isLiked = false;
      } else {
        //update vue store
        profile.like_list.push(id);
        await store.dispatch(`user/${USER_UPDATE}`, profile);
      }
    } catch (err) {
      console.error(err);
      isLiked = false;
    }
    return await isLiked;
  };

  const removeLikePost = async (isLiked, profile, user_name, id) => {
    if (user_name === "") {
      user_name = profile?.user_name;
    }
    try {
      //remove like post
      const res = await userRepository.removeLikePost(user_name, {
        id,
      });
      //if remove fail
      if (!res?.data.success) {
        isLiked.value = !isLiked.value;
      } else {
        //update vue store
        profile.like_list = profile.like_list.filter((postId) => postId !== id);
        await store.dispatch(`user/${USER_UPDATE}`, profile);
      }
    } catch (err) {
      console.error(err);
      isLiked = true;
    }
    return await isLiked;
  };

  const bookmarkPost = async (wasBookmarked, profile, user_name, id) => {
    //add bookmark
    try {
      const res = await userRepository.addBookmarkPost(user_name, {
        id,
      });
      //bookmark fail => assign wasBookmarked state is false
      if (!res?.data.success) {
        wasBookmarked = false;
      } else {
        //update vue store
        profile.bookmark_posts.push(id);
        await store.dispatch(`user/${USER_UPDATE}`, profile);
      }
    } catch (err) {
      console.error(err);
      wasBookmarked = false;
    }
    return await wasBookmarked;
  };

  const removeBookmarkPost = async (wasBookmarked, profile, user_name, id) => {
    //remove bookmark
    try {
      const res = await userRepository.removeBookmarkPost(user_name, {
        id,
      });
      //remove bookmark fail => reverse wasBookmarked state
      if (!res?.data.success) {
        wasBookmarked = !wasBookmarked;
      } else {
        //update vue store
        profile.bookmark_posts = profile.bookmark_posts.filter(
          (postId) => postId !== id
        );
        await store.dispatch(`user/${USER_UPDATE}`, profile);
      }
    } catch (err) {
      console.error(err);
      wasBookmarked = !wasBookmarked;
    }
    return await wasBookmarked;
  };

  const publish = async (titleInvalid, postSuccessfully, postPayload) => {
    try {
      const res = await postRepository.createPost(postPayload);
      if (res?.data.message === "Duplicated title") {
        titleInvalid.status = true;
        titleInvalid.message = "Tiêu đề đã bị trùng!";
        return;
      }

      if (res?.data.success) {
        postSuccessfully.value = true;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const update = async (titleInvalid, postSuccessfully, content, slug) => {
    try {
      const res = await postRepository.updatePost(slug, content);
      if (res?.data.message === "Duplicated title") {
        titleInvalid.status = true;
        titleInvalid.message = "Tiêu đề đã bị trùng!";
        return;
      }
      if (res?.data.success) {
        postSuccessfully.value = true;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return {
    deletePost,
    likePost,
    removeLikePost,
    bookmarkPost,
    removeBookmarkPost,
    publish,
    update,
  };
}
