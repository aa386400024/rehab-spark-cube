<template>
	<view class="app">
		<!-- 页面内容开始 -->
		
		这里是页面内容
		
		<!-- 页面内容结束 -->
	</view>
</template>

<script>
	let vk = uni.vk;
	export default {
		data() {
			// 页面数据变量
			return {
				// init请求返回的数据
				data:{
					
				},
				// 表单请求数据
				form1:{
					
				},
				scrollTop:0,
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		// 监听 - 页面每次【加载时】执行(如：前进)
		onLoad(options = {}) {
			vk = uni.vk;
			this.options = options;
			this.init(options);
		},
		// 监听 - 页面【首次渲染完成时】执行。注意如果渲染速度快，会在页面进入动画完成前触发
		onReady(){},
		// 监听 - 页面每次【显示时】执行（如：前进和返回）（页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面）
		onShow() {},
		// 监听 - 页面每次【隐藏时】执行（如：返回）
		onHide() {},
		// 监听 - 页面每次【卸载时】（一般用于取消页面上的监听器）
		onUnload(){},
		// 监听 - 页面下拉刷新
		onPullDownRefresh() {
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		/**
		 * 监听 - 点击右上角转发时 文档 https://uniapp.dcloud.io/api/plugins/share?id=onshareappmessage
		 * 如果删除onShareAppMessage函数，则微信小程序右上角转发按钮会自动变灰
		 */
		onShareAppMessage(options) {
			
		},
		// 函数
		methods: {
			// 页面数据初始化函数
			init(options={}){
				console.log("init: ",options);
			}
		},
		// 监听器
		watch:{
			
		},
		// 计算属性
		computed:{
			
		}
	}
</script>
<style lang="scss" scoped>
	
</style>