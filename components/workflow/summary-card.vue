<template>
	<view class="summary-card">
		<view class="summary-title">{{ summary.title }}</view>
		<view class="summary-content">{{ summary.content }}</view>
	</view>
</template>

<script setup>
	const props = defineProps({
		summary: Object, // 当前总结内容
	});
</script>

<style scoped>
	.summary-card {
		padding: 16px;
		border: 1px solid #ccc;
		border-radius: 4px;
		background-color: #fbfbfb;
		margin-bottom: 20px;
	}

	.summary-title {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 8px;
	}

	.summary-content {
		font-size: 14px;
		color: #666;
	}
</style>