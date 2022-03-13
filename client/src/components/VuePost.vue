<template>
  <div class="w-full h-fit mt-11">
    <!-- title  -->
    <div
      class="select-none border-l-4 border-button px-2 flex items-center hover:text-button"
    >
      <h1 class="text-sm font-semibold uppercase">
        {{ title }}
      </h1>
    </div>
    <!-- list render post  -->
    <div class="w-full my-4 h-fit overflow-hidden grid grid-cols-3">
      <div
        class="w-full h-full cursor-pointer col-span-1 absolute-center"
      >
        <img
          class="w-[80%] max-h-[70%] md:max-h-[90%] rounded-xl"
          src="https://animecorner.me/wp-content/uploads/2022/03/Untitled-design-3.png"
          alt=""
        />
      </div>
      <div class="col-span-2 h-fit py-2 cursor-pointer">
        <h2
          class="pr-2 md:text-2xl text-lg lg:w-[80%] post-title overflow-hidden hover:text-button"
        >
          Crunchyroll and Wakanim Suspend Streaming Services in Russia 
        </h2>
        <div class="pr-2 lg:w-[80%]">
          <div class="overflow-hidden post-desc">
            <p class="md:block hidden">
              Crunchyroll and Wakanim announced that they are suspending their
              services for the Russian market. Both platforms have issued a
              brief announcement on their Russian homepage, stating that the
              suspension follows Crunchyroll and Wakanim announced that they are
              suspending their services for the Russian market. Both platforms
              have issued a brief announcement on their Russian homepage,
              stating that the suspension follows 
            </p>
          </div>
          <div class="w-full overflow-hidden whitespace-nowrap">
            <span class="text-[15px] text-gray-400 hover:text-button"
              >User</span
            >
            <span class="text-[15px] text-gray-400"> | March 10, 2022</span>
          </div>
        </div>
      </div>
    </div>
  
   <div class="w-full my-4 h-fit overflow-hidden grid grid-cols-3">
      <div
        class="w-full h-full cursor-pointer col-span-1 absolute-center"
      >
        <img
          class="w-[80%] max-h-[70%] md:max-h-[90%] rounded-xl"
          src="https://animecorner.me/wp-content/uploads/2022/03/demon-girl.png"
          alt=""
        />
      </div>
      <div class="col-span-2 h-fit py-2 cursor-pointer">
        <h2
          class="pr-2 md:text-2xl text-lg lg:w-[80%] post-title overflow-hidden hover:text-button"
        >
          Demon Girl Next Door Season Reveals Theme Songs in 2nd Trailer
        </h2>
        <div class="pr-2 lg:w-[80%]">
          <div class="overflow-hidden post-desc">
            <p class="md:block hidden">
             Season 2 of The Demon Girl Next Door anime adaptation introduced new characters and theme songs in a new trailer. The anime sequel will begin airing on April 7
            </p>
          </div>
          <div class="w-full overflow-hidden whitespace-nowrap">
            <span class="text-[15px] text-gray-400 hover:text-button"
              >User</span
            >
            <span class="text-[15px] text-gray-400"> | March 10, 2022</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
  },
  setup() {
    return {};
  },
};
</script>
