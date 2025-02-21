<template>
	<!-- 通用的卡片列表容器 -->
	<view class="card-list-container">
		<!-- 标题栏 -->
		<view class="header-container">
			<text class="header-title">{{ title }}</text>
			<view class="more-button" @click="handleViewMore">{{ moreText }}</view>
		</view>
		<!-- 循环渲染卡片 -->
		<view class="card-item" v-for="(item, index) in itemList" :key="index">
			<view class="card-image-wrapper">
				<image :src="item.imageUrl" mode="aspectFit"></image>
				<view class="card-info">
					<text class="card-title">{{ item.title  }}</text>
					<text class="card-description">{{ item.desc  }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';

	// 定义组件的 props
	const props = defineProps({
		// 容器标题
		title: {
			type: String,
			default: '适合你的经典计划'
		},
		// 查看更多按钮的文本
		moreText: {
			type: String,
			default: '查看更多 >'
		},
		// 卡片数据列表
		itemList: {
			type: Array,
			default: () => []
		},
		// 点击查看更多的回调函数
		onViewMore: {
			type: Function,
			default: () => () => console.log(' 点击了查看更多')
		}
	});

	// 处理查看更多的逻辑
	const handleViewMore = () => {
		props.onViewMore();
	};
</script>

<style lang="scss" scoped>
	.card-list-container {
		padding: 20rpx;
	}

	.header-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.header-title {
		font-size: 32rpx;
		font-weight: bold;
	}

	.more-button {
		font-size: 20rpx;
		color: #999;
	}

	.card-item {
		background-color: #fff;
		border-radius: 10rpx;
		overflow: hidden;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
	}

	.card-image-wrapper {
		width: 100%;
		height: 300rpx;
		position: relative;
	}

	.card-image-wrapper image {
		width: 100%;
		height: 100%;
	}

	.card-info {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
		position: absolute;
		bottom: 10rpx;
		left: 10rpx;
		padding: 20rpx;
		color: #333;
		width: 100%;
	}

	.card-title {
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.card-description {
		font-size: 26rpx;
		color: #666;
	}
</style>