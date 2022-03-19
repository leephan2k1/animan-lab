<template>
  <div class="w-full lg:h-[700px] h-[700px] md:h-[800px]">
    <div class="w-full h-full grid grid-cols-2">
      <div class="col-span-2 md:col-span-1 flex flex-col items-center">
        <div
          class="w-3/4 md:w-full h-[150px] flex flex-col justify-center text-lg my-4 bg-white rounded-xl shadow-lg"
        >
          <p class="ml-4 hover:text-button cursor-pointer">
            Nghiên cứu đã viết: <span class="font-bold">50</span>
          </p>
          <p class="ml-4 hover:text-button cursor-pointer">
            Nghiên cứu đã thích: <span class="font-bold">100</span>
          </p>
          <p class="ml-4 hover:text-button cursor-pointer">
            Nghiên cứu đang theo dõi: <span class="font-bold">11</span>
          </p>
        </div>
        <div
          class="w-3/4 md:w-full h-[150px] flex flex-col justify-center text-lg my-4 bg-white rounded-xl shadow-lg"
        >
          <p class="ml-4 hover:text-button cursor-pointer">
            Danh hiệu: <span class="font-bold">Wibu thuỷ tổ</span>
          </p>
          <p class="ml-4 hover:text-button cursor-pointer">
            Điểm: <span class="font-bold">Infinity</span>
          </p>
          <div class="ml-4 my-2">
            <k-progress
              class="whitespace-nowrap"
              :percent="101"
              :format="format"
              active
              :color="['#f5af19', '#f12711', '#9254de', '#40a9ff', '#5cdbd3']"
            ></k-progress>
          </div>
        </div>
        <div
          class="w-3/4 md:w-full h-[150px] flex flex-col justify-center text-lg my-4 bg-white rounded-xl shadow-lg"
        >
          <p class="ml-4 hover:text-button cursor-pointer">
            Căn cước công dân wibu: <span class="font-bold">Wibu_top_1_VN</span>
          </p>
          <p class="ml-4 hover:text-button cursor-pointer">
            Trở thành học giả wibu: <span class="font-bold">15/3/2022</span>
          </p>
        </div>
      </div>
      <div class="col-span-2 md:col-span-1 flex flex-col items-center">
        <div
          class="md:mb-0 mb-12 mt-4 w-[90%] h-fit bg-white rounded-xl shadow-xl flex flex-col"
        >
          <h2 class="text-center font-bold py-4">Cách tính điểm</h2>
          <ul class="w-full list-circle list-inside">
            <li class="my-2 ml-4">
              Nghiên cứu được phê duyệt:
              <span class="font-bold">10 points</span>
            </li>
            <li class="my-2 ml-4">
              Nghiên cứu bị xoá bởi admin (Vi phạm luật pháp wibu):
              <span class="font-bold">-10 points</span>
            </li>
            <li class="my-2 ml-4">
              Mỗi like trên nghiên cứu: <span class="font-bold">1 point</span>
            </li>
            <li class="my-2 ml-4">
              Phản biện nghiên cứu (comment dạo):
              <span class="font-bold">1 point</span>
            </li>
            <li class="my-2 ml-4">
              Phản biện được thích (comment được like):
              <span class="font-bold">1 point</span>
            </li>
          </ul>
          <h2 class="text-center font-bold py-4">Cách tính danh hiệu</h2>
          <ul class="w-full list-circle list-inside">
            <li class="my-2 ml-4">
              0 point:
              <span class="font-bold">Con dân wibu</span>
            </li>
            <li class="my-2 ml-4">
              50 points:
              <span class="font-bold">Thạc sĩ wibu</span>
            </li>
            <li class="my-2 ml-4">
              100 points: <span class="font-bold">Tiến sĩ Otachym</span>
            </li>
            <li class="my-2 ml-4">
              300 points :
              <span class="font-bold">Giáo sư weeaboo</span>
            </li>
            <li class="my-2 ml-4">
              500 points:
              <span class="font-bold">Lãnh tụ tinh thần wibu</span>
            </li>
            <li class="my-2 ml-4">
              1000 points:
              <span class="font-bold">Đấng cứu thế wibu được Isekai</span>
            </li>
          </ul>
          <h2 class="text-center font-bold py-4">Animan rules</h2>
          <ul class="w-full list-circle list-inside">
            <li class="my-2 ml-4">
              Vi phạm điều khoản lần đầu:
              <span class="font-bold">Cấm bình luận và đăng bài</span>
            </li>
            <li class="my-2 ml-4">
              Vi phạm điều khoản lần hai:
              <span class="font-bold">Xoá tài khoản</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import KProgress from "k-progress-v3";
export default {
  components: {
    "k-progress": KProgress,
  },
  props: {
    achievementsData: {
      type: String,
    },
  },
  setup(props) {

    const format = (percent) => {
      if (percent > 100) {
        return " -Infinity- ";
      }
      return `${percent * 10} points`;
    };

    return { format };
  },
};
</script>
