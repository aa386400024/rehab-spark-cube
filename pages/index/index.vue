<template>
	<view>
		<card-list 
			:title="customTitle" 
			:moreText="customMoreText" 
			:itemList="customPlanList" 
			@onCardClick="handleCardClick"
		/>
	</view>
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

	const customTitle = ref('我的专属计划');
	const customMoreText = ref('查看全部检测');
	const customPlanList = ref([{
			id: 1, // 唯一标识符
			name: 'PlanA',
			title: '快速减脂计划',
			imageUrl: 'https://mp-c323035b-5498-4245-b5ac-ff13429389dd.cdn.bspapp.com/banner/ai-rehab.png',
			iconType: 'iconType1',
			iconSize: 20,
			iconColor: '#333',
			desc: '5天快速燃脂'
		},
		{
			id: 2, // 唯一标识符
			name: 'PlanA',
			title: '增肌塑形计划',
			imageUrl: 'https://mp-c323035b-5498-4245-b5ac-ff13429389dd.cdn.bspapp.com/banner/ai-rehab.png',
			iconType: 'iconType1',
			iconSize: 20,
			iconColor: '#333',
			desc: '8周肌肉增长'
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