<template>
	<view class="training-plan-card" @click="handleClick">
		<!-- 标签 -->
		<view v-if="tag" class="tag">{{ tag }}</view>

		<!-- 背景图 -->
		<view class="card-bg">
			<image class="background-image" :src="backgroundImage" mode="aspectFill"></image>
		</view>

		<!-- 内容部分 -->
		<view class="content">

			<!-- 标题和描述 -->
			<view class="title">{{ title }}</view>
			<view class="subtitle">{{ subtitle }}</view>

			<!-- 动态字段 -->
			<view class="info">
				<view class="info-item" v-for="(item, index) in infoList" :key="index">
					<view class="label">{{ item.label }}</view>
					<view class="value">{{ item.value }}</view>
				</view>
			</view>

			<!-- 底部提示按钮 -->
			<view class="action">
				<text class="action-text">{{ actionText }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';

	// 通过 props 动态接受数据

	defineProps({
		title: {
			type: String,
			default: '训练计划标题',
		},
		subtitle: {
			type: String,
			default: '带你稳拿新目标 ~',
		},
		tag: {
			type: String,
			default: '',
		},
		backgroundImage: {
			type: String,
			default: '', // 默认无背景图
		},
		infoList: {
			type: Array,
			default: () => [{
					label: '计划时长',
					value: 'N/A'
				},
				{
					label: '每周训练',
					value: 'N/A'
				},
				{
					label: '预计消耗',
					value: 'N/A'
				},
			],
		},
		actionText: {
			type: String,
			default: '评估身体状况，为你定制训练方案',
		},
	});

	// 定义要触发的事件
	const emit = defineEmits(['cardClick']);

	// 点击事件处理函数
	const handleClick = () => {
		emit('cardClick');
	};
</script>

<style lang="scss" scoped>
	.training-plan-card {
		position: relative;
		width: 100%;
		overflow: hidden;
		color: #fff;
		padding: 30rpx;

		.tag {
			position: absolute;
			top: 0;
			right: 30rpx;
			display: inline-block;
			padding: 4rpx 8rpx;
			margin-bottom: 12rpx;
			background-color: #4a90e2;
			border-radius: 6rpx;
			font-size: 20rpx;
		}

		.card-bg {
			position: absolute;
			top: 0;
			left: 30rpx;
			right: 30rpx;
			border-radius: 6rpx;
			height: 360rpx;
			z-index: -1;

			.background-image {
				border-radius: 6rpx;
				width: 100%;
				height: 100%;
			}
		}

		.content {
			padding: 0 30rpx;

			.title {
				font-weight: bold;
				font-size: 38rpx;
				margin: 20rpx auto 8rpx;
			}

			.subtitle {
				font-size: 22rpx;
				color: #ddd;
				margin-bottom: 28rpx;
			}

			.info {
				display: flex;
				justify-content: space-between;
				margin-bottom: 24rpx;

				.info-item {
					text-align: left;

					.value {
						font-weight: bold;
						font-size: 28rpx;
						margin-bottom: 4rpx;
					}

					.label {
						font-size: 20rpx;
						color: #ccc;
					}
				}
			}

			.action {
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				background-color: #4b4854;
				border-radius: 30rpx;
				font-size: 24rpx;
				margin-bottom: 12rpx;

				.action-text {
					font-weight: 400;
					color: #fff;
				}
			}
		}
	}
</style>