<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-6 w-6"
    :class="styles"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
    v-if="buttonType === 'x'"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-6 w-6"
    :class="styles"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
    v-if="buttonType === '<'"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
</template>

<script>
export default {
  props: {
    buttonType: {
      type: String,
      default: "x",
    },
    styles: {
      type: String,
    },
  },
};
</script>
