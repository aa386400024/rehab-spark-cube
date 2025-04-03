<template>
	<view class="progress-container">
		<!-- 渲染进度 -->
		<view v-for="(step, index) in vk.vuex.get('$workflow.steps')" :key="step.stepId" class="section-progress">
			<view class="progress-bar">
				<u-line-progress active-color="#2979ff" inactive-color="#f0f0f0" height="14" :show-percent="false"
					:striped="true" :striped-active="true" :percent="vk.vuex.getters('$workflow/stepProgress', step.stepId)">
				</u-line-progress>
			</view>
		</view>
	</view>
</template>

<script setup>
	let vk = uni.vk;
	import {
		ref,
		computed
	} from "vue";

	const props = defineProps({
		steps: Array,
	});
</script>

<style scoped lang="scss">
	.progress-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8rpx;
		gap: 14rpx;

		.section-progress {
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			// margin-left: 20rpx;
			.progress-bar {
				width: 100%;
			}
		}
	}
</style>