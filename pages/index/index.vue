<template>
	<z-paging ref="paging">
		<view>
			<training-plan-card 
				title="开启智能康复之旅 重塑健康活力之躯" 
				subtitle="全程守护，见证身体蜕变之路" 
				tag="专为 酷酷的大炮 打造"
				:backgroundImage="backgroundImage" 
				:infoList="[
					{ label: '康复周期', value: '4-8周' },
					{ label: '运动频次', value: '3-5次/周' },
					{ label: '康复效果', value: '30%体能' }
				]" 
				actionText="立即评估，开启康复计划" 
				@cardClick="handleTopCardClick"
			/>
			<card-list 
				:title="customTitle" 
				:moreText="customMoreText" 
				:itemList="customPlanList"
				@onCardClick="handleCardClick" 
			/>
		</view>
	</z-paging>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onPageScroll,
		onLoad,
		onReady,
		onShow,
		onHide
	} from '@dcloudio/uni-app';
	let vk = uni.vk;

	// 页面数据变量
	const data = ref({});
	const form1 = ref({});
	const scrollTop = ref(0);
	const options = ref({});
	const backgroundImage = ref('https://mp-c323035b-5498-4245-b5ac-ff13429389dd.cdn.bspapp.com/banner/training-plan-banner.png');

	const customTitle = ref('AI智能康复检测');
	const customMoreText = ref('全部能力');
	const customPlanList = ref([{
			id: 1,
			name: 'painDetection',
			title: 'AI 痛感检测',
			imageUrl: 'https://mp-c323035b-5498-4245-b5ac-ff13429389dd.cdn.bspapp.com/banner/ai-rehab.png',
			iconType: 'painIcon',
			iconSize: 20,
			iconColor: '#ff3333',
			desc: '通过AI技术实时评估和监测患者的疼痛状况',
		},
		{
			id: 2,
			name: 'mobilityAnalysis',
			title: '运动能力分析',
			imageUrl: 'https://mp-c323035b-5498-4245-b5ac-ff13429389dd.cdn.bspapp.com/banner/ai-rehab.png',
			iconType: 'mobilityIcon',
			iconSize: 20,
			iconColor: '#33ccff',
			desc: '评估及改善患者的运动能力和灵活性',
		},
		{
			id: 3,
			name: 'postureCorrection',
			title: '姿势矫正预测',
			imageUrl: 'https://mp-c323035b-5498-4245-b5ac-ff13429389dd.cdn.bspapp.com/banner/ai-rehab.png',
			iconType: 'postureIcon',
			iconSize: 20,
			iconColor: '#66cc66',
			desc: '使用AI识别不良姿势并提供矫正建议',
		},
		{
			id: 4,
			name: 'stressAssessment',
			title: 'AI 应激评估',
			imageUrl: 'https://mp-c323035b-5498-4245-b5ac-ff13429389dd.cdn.bspapp.com/banner/ai-rehab.png',
			iconType: 'stressIcon',
			iconSize: 20,
			iconColor: '#ff9933',
			desc: '监测心理压力水平并提供应对策略',
		},
		{
			id: 5,
			name: 'rehabProgressTracking',
			title: '康复进度追踪',
			imageUrl: 'https://mp-c323035b-5498-4245-b5ac-ff13429389dd.cdn.bspapp.com/banner/ai-rehab.png',
			iconType: 'progressIcon',
			iconSize: 20,
			iconColor: '#6633cc',
			desc: '通过数据分析追踪病患的康复进程',
		}
	]);

	// 监听页面滚动
	onPageScroll((e) => {
		scrollTop.value = e.scrollTop;
	});

	// 监听页面加载
	onLoad((opt) => {
		options.value = opt;
		init(opt);
	});

	// 监听页面首次渲染完成
	onReady(() => {
		// 这里可以添加页面首次渲染完成后的逻辑
	});

	// 监听页面显示
	onShow(() => {
		// 这里可以添加页面显示时的逻辑
	});

	// 监听页面隐藏
	onHide(() => {
		// 这里可以添加页面隐藏时的逻辑
	});

	// 页面数据初始化函数
	const init = (opt) => {
		// vk.reLaunch("/pages_template/uni-id/index/index");
	};

	// 跳转到指定页面的函数
	const pageTo = (path) => {
		vk.navigateTo(path);
	};
	
	const handleTopCardClick = () => {
		vk.navigateTo({
			url: '/subpages/evalution-manager/evalution-manager', // 替换为实际功能页路径
			success: (res) => {
				console.log('跳转成功');
			},
			fail: (err) => {
				console.log('跳转失败', err);
			}
		});
	};

	const handleCardClick = (item, index) => {
		console.log(' 点击了卡片', item, index);
		vk.navigateTo({
			url: '/subpages/person-model/person-model', // 替换为实际功能页路径
			success: (res) => {
				console.log('跳转成功');
			},
			fail: (err) => {
				console.log('跳转失败', err);
			}
		});
	};

	// 点击右上角转发时的处理函数
	const onShareAppMessage = (opt) => {
		// 这里可以添加分享逻辑
	};

	// 暴露 onShareAppMessage 给 UniApp 框架
	defineExpose({
		onShareAppMessage
	});
</script>

<style lang="scss" scoped>

</style>