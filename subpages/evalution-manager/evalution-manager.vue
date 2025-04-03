<template>
	<view class="app-container">
		<u-navbar :custom-back="customBack" back-icon-size="32" :is-fixed="false" :immersive="true">
			<!-- 在插槽中展示进度条 -->
			<view class="slot-wrap">
				<ProgressBar v-if="currentStage === 'workflow'" />
			</view>
		</u-navbar>
		<!-- 欢迎页 -->
		<view v-if="currentStage === 'welcome'" class="card">
			<text v-if="currentCard === 1" class="title">欢迎使用智愈魔方</text>
			<text v-else class="title">

				接下来我将问您几个问题，定制您的专属康复方案
			</text>
		</view>

		<!-- 选择目标 -->
		<view v-if="currentStage === 'selection'" class="selection-container">
			<text class="title">请选择您的康复目标</text>
			<view class="options">
				<u-button v-for="(option, index) in recoveryOptions" :key="index" :custom-style="customStyle"
					@click="selectOption(option)">
					{{ option }}
				</u-button>
			</view>
		</view>

		<!-- 工作流页 -->
		<view class="workflow" v-if="currentStage === 'workflow'">
			<workflow />
		</view>
	</view>
</template>

<script setup>
	let vk = uni.vk;
	import {
		ref,
		onMounted,
		computed
	} from 'vue';
	import {
		mapState,
		mapActions
	} from 'vuex';
	import ProgressBar from "@/components/workflow/progress-bar.vue"

	// 当前阶段状态
	const currentStage = ref('welcome'); // 初始化为欢迎页
	const currentCard = ref(1); // 控制欢迎页显示的卡片

	const recoveryOptions = [
		'运动损伤康复',
		'老年日常功能维护',
		'职场亚健康调理',
		'青少年姿势矫正',
		'睡眠障碍干预',
	];

	const customStyle = ref({
		marginTop: '20px', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
		color: 'red'
	})

	// Mock 工作流数据
	const workflowData = {
		totalSteps: 3,
		workflowId: 'injury_assessment',
		workflowName: '运动损伤评估',
		steps: [{
				stepId: 1,
				title: '基本信息收集',
				questions: [{
						type: 'text',
						label: '您的年龄',
						id: 'age',
						placeholder: '请输入您的年龄'
					},
					{
						type: 'text',
						label: '您的身高',
						id: 'height',
						placeholder: '请输入您的身高'
					},
					{
						type: 'text',
						label: '您的体重',
						id: 'weight',
						placeholder: '请输入您的体重'
					},
					{
						type: 'bodyTypeSelector',
						label: '身体体型选择',
						id: 'bodyType',
						options: [{
								image: '/assets/bodyType1.jpg',
								description: '瘦弱型'
							},
							{
								image: '/assets/bodyType2.jpg',
								description: '健壮型'
							},
						],
					},
				],
				hasSummary: true,
				summary: {
					type: 'dataReview',
					title: '完成基本信息收集',
					content: '您即将进入损伤信息收集步骤。',
				},
			},
			{
				stepId: 2,
				title: '损伤信息收集',
				questions: [{
						type: 'select',
						label: '请描述您的损伤部位',
						id: 'injury_part',
						options: ['膝关节', '肩关节', '脚踝']
					},
					{
						type: 'slider',
						label: '疼痛程度（0-10）',
						id: 'pain_level',
						range: {
							min: 0,
							max: 10
						},
					},
				],
				hasSummary: true,
				summary: {
					type: 'nextStepPreview',
					title: '下一步预览',
					content: '即将进入影像资料上传环节，请准备好相关文件。',
				},
			},
			{
				stepId: 3,
				title: '影像资料上传',
				questions: [{
					type: 'file',
					label: '上传您的影像资料',
					id: 'medical_report',
					placeholder: '请选择文件'
				}, ],
				hasSummary: false,
			},
		],
	};

	// 返回逻辑
	const customBack = () => {
		const currentStepId = vk.getVuex('$workflow.currentStepId'); // 获取当前步骤 ID
		const currentPageIndex = vk.getVuex('$workflow.currentPageIndex'); // 获取当前页面索引
		const isSummaryVisible = vk.getVuex('$workflow.isSummaryVisible'); // 是否在总结页面
		if (currentStage.value == 'selection') {
			vk.navigateToHome();
		} else if (currentStepId === 1 && currentPageIndex === 0 && !isSummaryVisible) {
			currentStage.value = 'selection';
		} else if (currentStage.value == 'workflow') {
			// 使用 vk.vuex.dispatch 或者通过其他方式返回
			vk.vuex.dispatch('$workflow/goToPreviousStep');
		}
	};

	// 动画流程控制逻辑
	onMounted(() => {
		vk.vuex.commit('$workflow/setWorkflowSteps', workflowData.steps);
		vk.setVuex('$workflow.workflow', workflowData);
		setTimeout(() => {
			currentCard.value = 2; // 切换到欢迎页第二张卡片
		}, 2000);

		setTimeout(() => {
			currentStage.value = 'selection'; // 切换到选择目标页
		}, 4000);
	});

	// 用户选择目标后进入工作流
	const selectOption = (option) => {
		console.log(`用户选择了：${option}`);
		// 通过 Vuex 重置状态
		vk.vuex.commit('$workflow/setCurrentStepId', 1); // 重置为第一个步骤
		vk.vuex.commit('$workflow/setCurrentPageIndex', 0); // 重置为第一个问题
		vk.vuex.commit('$workflow/setIsSummaryVisible', false); // 不显示总结页面
		currentStage.value = 'workflow'; // 切换到工作流页面
	};
</script>

<style scoped lang="scss">
	.app-container {
		height: 100vh;
		// padding: 0 30rpx;
	}

	.slot-wrap {
		// display: flex;
		// justify-content: center;
		// align-items: center;
		/* 如果您想让slot内容占满整个导航栏的宽度 */
		flex: 1;
		/* 如果您想让slot内容与导航栏左右有空隙 */
		padding: 0 30rpx;
	}

	.workflow {
		padding: 30rpx;
		// margin-top: 200rpx;
	}

	.card {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.selection-container {
		text-align: center;
		padding: 30rpx;
	}

	.options {
		display: flex;
		flex-direction: column;
	}
</style>