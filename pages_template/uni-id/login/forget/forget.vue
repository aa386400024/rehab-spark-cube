<template>
	<view class="app forget">
		<!-- 页面内容开始 -->

		<view class="content">
			<!-- 主体 -->
			<view class="form-view">
				<view class="tips">若你忘记了密码，可在此重置新密码。</view>

				<view class="form-item form-border">
					<!-- 文本框 -->
					<input class="form-input" v-model="form1.mobile" type="text" :maxlength="11" placeholder="请输入手机号码" placeholder-style="'color':'#8e8e8e'" />
				</view>

				<view class="form-item form-border">
					<!-- 文本框 -->
					<input class="form-input" v-model="form1.password" type="password" placeholder="请输入新密码" placeholder-style="'color':'#8e8e8e'" />
				</view>
				<view class="form-item form-border">
					<!-- 文本框 -->
					<input class="form-input" v-model="form1.password2" type="password" placeholder="请再次输入新密码" placeholder-style="'color':'#8e8e8e'" />
				</view>


				<view class="form-item form-border">
					<!-- 文本框 -->
					<input class="form-input" v-model="form1.code" type="number" :maxlength="6" placeholder="请输入验证码" placeholder-style="'color':'#8e8e8e'" />
					<!-- 验证码倒计时开始 -->
					<vk-data-verification-code :check-user-exist="true" seconds="60" :mobile="form1.mobile" type="reset-pwd" custom-style="font-size: 28rpx;"></vk-data-verification-code>
					<!-- 验证码倒计时结束 -->

				</view>

			</view>
			<view class="login-btn">
				<button class="btn success circle" hover-class="hover" shape="circle" @click="resetPassword" :plain="false" :hair-line="false" type="success">重置密码</button>
			</view>
		</view>
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
					mobile:"",
					password:"",
					password2:"",
					code:""
				},
				scrollTop:0,
				isRotate:false
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		// 监听 - 页面每次【加载时】执行(如：前进)
		onLoad(options) {
			//console.log("onLoad",options);
			vk = uni.vk;
			this.init(options);
		},
		// 监听 - 页面【首次渲染完成时】执行。注意如果渲染速度快，会在页面进入动画完成前触发
		onReady(){

		},
		// 监听 - 页面每次【显示时】执行(如：前进和返回) (页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面)
		onShow() {

		},
		// 监听 - 页面每次【隐藏时】执行(如：返回)
		onHide() {


		},
		// 监听 - 页面下拉刷新
		onPullDownRefresh() {
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		// 监听 - 点击右上角转发时
		onShareAppMessage(options) {

		},
		// 函数
		methods: {
			// 页面数据初始化函数
			init(options = {}){
				console.log("init: ",options);
			},
			pageTo(path){
				vk.navigateTo(path);
			},
			resetPassword() {
				let that = this;
				const { mobile, code, password, password2 } = that.form1;
				//重置密码
				if(that.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if(!vk.pubfn.test(mobile, 'mobile')){
					vk.toast('请输入正确的手机号码',"none");
					return;
				}
				if(!vk.pubfn.test(password, 'pwd')){
					vk.toast('密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线',"none");
					return;
				}
				if(!vk.pubfn.test(password2, 'pwd')){
					vk.toast('密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线',"none");
					return;
				}
				if(password != password2){
					vk.toast('两次密码必须相同!',"none");
					return;
				}
				if(!vk.pubfn.test(code, 'mobileCode')){
					vk.toast('验证码格式为6位数字',"none");
					return;
				}
				that.isRotate = true;
				vk.userCenter.resetPasswordByMobile({
					data:that.form1,
					success: (data) => {
						that.isRotate = false;
						vk.alert("密码重置成功,新密码为:"+password,()=>{
							// 进入登录页
							vk.redirectTo("../index/index");
						});
					},
					complete:() => {
						that.isRotate = false;
					}
				});
			}
		},
		// 计算属性
		computed:{

		}
	}
</script>
<style lang="scss" scoped>
	@import url("../css/main.css");
</style>
