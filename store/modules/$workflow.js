// 从本地存储中获取已有的数据，确保状态的持久化

let lifeData = uni.getStorageSync('lifeData') || {};
let $workflow = lifeData.$workflow || {}; // 从本地存储获取工作流数据

export default {
	namespaced: true, // 启用命名空间
	/**
	 * vuex 的基本数据，用来存储变量
	 */
	state: {
		workflow: $workflow.workflow,
		totalSteps: $workflow.totalSteps || 3, // 总步骤数
		currentStepId: $workflow.currentStepId || 1, // 当前步骤 ID
		currentPageIndex: $workflow.currentPageIndex || 0, // 当前步骤中的页面索引
		isSummaryVisible: $workflow.isSummaryVisible || false, // 是否在总结页面
		steps: $workflow.steps || [], // 总步骤数据
	},

	/**
	 * 从基本数据 (state) 派生的数据，相当于 state 的计算属性
	 */
	getters: {
		/**
		 * 根据步骤 ID 计算进度条百分比
		 * @param {Object} state - Vuex 的状态对象
		 * @return {Function} - 返回一个函数，用于根据 stepId 计算百分比
		 */
		stepProgress: (state) => (stepId) => {
			const step = state.steps.find((step) => step.stepId === stepId);
			if (!step) return 0;
			const totalPagesInStep = step.questions.length + (step.hasSummary ? 1 : 0); // 总页数（包括总结页）
			let currentIndexInStep = 0;
			if (stepId < state.currentStepId) {
				return 100; // 已完成的步骤进度为 100%
			} else if (stepId === state.currentStepId) {
				// 当前步骤
				if (!state.isSummaryVisible && state.currentStepId === 1 && state.currentPageIndex === 0) {
					// 如果是初始化状态，进度条为 0（第一步骤完全未点击）。
					return 0;
				}
				currentIndexInStep = state.isSummaryVisible ?
					totalPagesInStep :
					state.currentPageIndex + 1;
				return (currentIndexInStep / totalPagesInStep) * 100;
			} else {
				return 0; // 未开始的步骤进度为 0%
			}
		},
	},

	/**
	 * 提交更新数据的方法，必须是同步的
	 * 每个 mutation 提交的载荷 (payload) 用于更改状态
	 */

	mutations: {
		/**
		 * 更新当前步骤 ID
		 * @param {Object} state - Vuex 的状态对象
		 * @param {Number} stepId - 新的步骤 ID
		 */

		setCurrentStepId(state, stepId) {
			state.currentStepId = stepId;
		},

		/**
		 * 更新当前页面索引
		 * @param {Object} state - Vuex 的状态对象
		 * @param {Number} pageIndex - 新的页面索引
		 */

		setCurrentPageIndex(state, pageIndex) {
			state.currentPageIndex = pageIndex;
		},

		/**
		 * 更新是否显示总结页面
		 * @param {Object} state - Vuex 的状态对象
		 * @param {Boolean} isVisible - 是否显示总结页
		 */

		setIsSummaryVisible(state, isVisible) {
			state.isSummaryVisible = isVisible;
		},

		/**
		 * 初始化工作流步骤数据
		 * @param {Object} state - Vuex 的状态对象
		 * @param {Array} steps - 工作流的步骤数据
		 */
		setWorkflowSteps(state, steps) {
			state.steps = steps;
		},
	},

	/**
	 * 和 mutation 相似，但可以包含异步操作
	 */
	actions: {
		/**
		 * 下一步逻辑
		 * @param {Object} param0 - 包含状态和 commit 的上下文对象
		 */
		goToNextPage({
			state,
			commit
		}) {
			const currentStep = state.steps.find(
				(step) => step.stepId === state.currentStepId
			);
			console.log('出发了下一步', currentStep)
			if (!currentStep) return;
			if (state.isSummaryVisible) {
				// 离开总结页，进入下一步
				commit("setIsSummaryVisible", false);
				if (state.currentStepId < state.totalSteps) {
					commit("setCurrentStepId", state.currentStepId + 1);
					commit("setCurrentPageIndex", 0);
				}
			} else if (state.currentPageIndex < currentStep.questions.length - 1) {
				// 当前步骤：跳转到下一页
				commit("setCurrentPageIndex", state.currentPageIndex + 1);
			} else if (currentStep.hasSummary) {
				// 当前步骤：进入总结页
				commit("setIsSummaryVisible", true);
			} else if (state.currentStepId < state.totalSteps) {
				console.log('完成当前步骤，进入下一步骤')
				// 完成当前步骤，进入下一步骤
				commit("setCurrentStepId", state.currentStepId + 1);
				commit("setCurrentPageIndex", 0);
			}
		},

		/**
		 * 上一步逻辑
		 * @param {Object} param0 - 包含状态和 commit 的上下文对象
		 */
		goToPreviousStep({
			state,
			commit
		}) {
			if (state.isSummaryVisible) {
				// 返回到当前步骤最后一页
				commit("setIsSummaryVisible", false);
			} else if (state.currentPageIndex > 0) {
				// 返回到当前步骤上一页
				commit("setCurrentPageIndex", state.currentPageIndex - 1);
			} else if (state.currentStepId > 1) {
				// 返回到上一步骤
				commit("setCurrentStepId", state.currentStepId - 1);
				const prevStep = state.steps.find(
					(step) => step.stepId === state.currentStepId
				);

				if (prevStep) {
					commit("setCurrentPageIndex", prevStep.questions.length - 1);
					commit("setIsSummaryVisible", !!prevStep.hasSummary);
				}
			}
		},
	},
};