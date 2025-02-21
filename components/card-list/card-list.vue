<template>
	<!-- 通用的卡片列表容器 -->
	<view class="card-list-container">
		<!-- 标题栏 -->
		<view class="header-container" v-if="showHeader">
			<text class="header-title" v-if="showHeaderTitle">{{ title }}</text>
			<view 
				class="more-button" 
				v-if="showMoreButton" 
				@click="handleViewMore"
			>
				{{ moreText }} 
				<u-icon 
					custom-prefix="custom-icon" 
					name="custom-icon-shequ" 
					size="20"
					color="#333" 
				></u-icon>
			</view>
		</view>
		<!-- 循环渲染卡片 -->
		<view 
			class="card-item" 
			v-for="(item, index) in itemList" 
			:key="index"
			@click="handleCardClick(item, index)"
		>
			<view class="card-image-wrapper">
				<image :src="item.imageUrl" mode="aspectFill"></image>
				<view class="card-info">
					<text class="card-title">{{ item.title  }}</text>
					<view class="card-description-wrapper">
						<u-icon 
							custom-prefix="custom-icon" 
							:name="item.iconType || 'custom-icon-kangfuke'" 
							:size="item.iconSize || iconSize"
							:color="item.iconColor || '#333'" 
							v-show="showIcon" 
						></u-icon>
						<text class="card-description">{{ item.desc  }}</text>
					</view>
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
			default: '查看更多'
		},
		// 卡片数据列表
		itemList: {
			type: Array,
			default: () => []
		},
		// 控制是否显示图标
		showIcon: {
			type: Boolean,
			default: true
		},
		iconSize: { 
			type: Number, 
			default: 30 ,
		},
		// 控制是否显示 header-container
		showHeader: {
			type: Boolean,
			default: true
		},
		// 控制是否显示 header-title
		showHeaderTitle: {
			type: Boolean,
			default: true
		},
		// 控制是否显示 more-button
		showMoreButton: {
			type: Boolean,
			default: true
		}
	});
	
	// 定义发出的事件
	const emit = defineEmits(['onViewMore', 'onCardClick']);
	 
	// 处理查看更多的逻辑
	const handleViewMore = () => {
		emit('onViewMore');
	};
	 
	// 处理卡片点击的逻辑
	const handleCardClick = (item, index) => {
		emit('onCardClick', item, index);
	};
</script>

<style lang="scss" scoped>
	.card-list-container {
		padding: 30rpx;
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
		font-size: 26rpx;
		color: #999;
	}

	.card-item {
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		margin-bottom: 26rpx;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
	}

	.card-image-wrapper {
		width: 100%;
		height: 240rpx;
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
		margin-bottom: 10rpx;
	}

	.card-description-wrapper {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.card-description {
		font-size: 24rpx;
		color: #666;
	}
</style>