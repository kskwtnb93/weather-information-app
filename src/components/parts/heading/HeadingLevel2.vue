<script setup lang="ts">
const props = defineProps({
  tag: {
    type: String,
    default: 'p',
    required: true,
  },
  id: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
    required: true,
  },
})
</script>

<template>
  <component
    :is="props.tag"
    :id="props.id"
    class="heading"
  >
    <span>{{ props.text }}</span>
  </component>
</template>

<style lang="scss" scoped>
.heading {
  font-size: 2.2rem;
  font-weight: bold;
}

@media screen and (max-width:750px) {
	.heading {
		font-size: 2rem;
	}
}
</style>
