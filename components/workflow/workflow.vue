<template>
	<view class="workflow-container">
		<!-- 当前步骤内容 -->
		<view class="step-container">
			<template v-if="!isSummaryVisible">
				<!-- 当前页问题部分 -->
				<view v-for="question in currentPageQuestions" :key="question.id">
					<TextInputCard v-if="question.type === 'text'" :question="question"
						@onAnswer="handleAnswer(question.id, $event)" />
					<SliderCard v-else-if="question.type === 'slider'" :question="question"
						@onAnswer="handleAnswer(question.id, $event)" />
					<FileUploadCard v-else-if="question.type === 'file'" :question="question"
						@onAnswer="handleAnswer(question.id, $event)" />
					<BodyTypeSelectorCard v-else-if="question.type === 'bodyTypeSelector'" :question="question"
						@onAnswer="handleAnswer(question.id, $event)" />
				</view>
			</template>
			<template v-else>
				<!-- 当前总结部分 -->
				<SummaryCard :summary="currentStepData.summary" />
			</template>
		</view>

		<!-- 下一步按钮 -->
		<button class="next-button" @click="goToNextPage" :disabled="!canProceedToNextPage">
			{{ isSummaryVisible ? "进入下一步" : "下一步" }}
		</button>
	</view>
</template>

<script setup>
	let vk = uni.vk;
	import {
		ref,
		computed,
		watch
	} from "vue";
	import TextInputCard from "./text-input-card.vue";
	import SliderCard from "./slider-card.vue";
	import FileUploadCard from "./file-upload-card.vue";
	import BodyTypeSelectorCard from "./body-type-selector-card.vue";
	import SummaryCard from "./summary-card.vue";

	// 获取工作流数据和状态
	const steps = computed(() => vk.getVuex('$workflow.steps'));
	const currentStepId = computed(() => vk.getVuex('$workflow.currentStepId'));
	const currentPageIndex = computed(() => vk.getVuex('$workflow.currentPageIndex'));
	const isSummaryVisible = computed(() => vk.getVuex('$workflow.isSummaryVisible'));
	console.log(steps.value, currentStepId.value, currentPageIndex.value, isSummaryVisible.value, 'workflow')

	const currentStepData = computed(() => {
		console.log(currentStepId.value, 'currentStepId.value')
		return steps.value.find((step) => step.stepId === currentStepId.value)
	});
	const currentStepQuestions = computed(() => currentStepData.value.questions);

	// ** 新增 ** 分页模式，`single` 表示单页一个问题，`multi` 表示一页多个问题
	const pageMode = ref("single"); // 默认为单页一个问题

	// ** 计算属性 ** 根据当前页索引，生成当前显示的问题列表
	const currentPageQuestions = computed(() => {
		const questions = currentStepQuestions.value || [];
		if (pageMode.value === "single") {
			// 单页一个问题
			return [questions[currentPageIndex.value]];
		} else {
			// 单页多个问题，显示所有问题
			return questions.slice();
		}
	});

	// 用户答案存储
	const userAnswers = ref({});

	// 是否完成全部问题
	const isCurrentStepComplete = computed(() => {
		if (isSummaryVisible.value) return true; // 如果是总结状态，自动认为完成
		return currentStepQuestions.value.every(
			(question) => userAnswers.value[question.id] !== undefined
		);
	});

	// 判断是否可以进入下一页
	const canProceedToNextPage = computed(() => {
		if (pageMode.value === "single") {
			return currentPageIndex.value < currentStepQuestions.value.length - 1;
		}
		return isCurrentStepComplete.value;
	});

	// 收集用户回答
	const handleAnswer = (id, value) => {
		userAnswers.value[id] = value;
	};

	// 处理跳转到下一页问题的逻辑
	const goToNextPage = () => {
		vk.vuex.dispatch('$workflow/goToNextPage');
	};
</script>

<style scoped>
	.workflow-container {
		display: flex;
		flex-direction: column;
		padding: 16px;
	}

	.step-container {
		display: flex;
		flex-direction: column;
		margin-bottom: 20px;
	}

	.back-button {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.back-icon {
		font-size: 20px;
		margin-right: 6px;
		color: #007bff;
	}

	.next-button {
		height: 40px;
		width: 100%;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
	}
</style>