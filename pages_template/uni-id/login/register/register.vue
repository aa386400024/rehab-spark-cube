<template>
	<view class="app register">
		<!-- 页面内容开始 -->
		<view class="content">
			<!-- 头部logo -->
			<view class="header"><image class="logo" :src="logoImage"></image></view>
			<!-- 主体 -->
			<view class="form-view">
				<view class="form-item form-border">
					<!-- 文本框 -->
					<input class="form-input" v-model="form1.mobile" type="text" :maxlength="11" placeholder="手机号" placeholder-style="'color':'#8e8e8e'" />
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
					<vk-data-verification-code seconds="60" :mobile="form1.mobile" type="register" custom-style="font-size: 28rpx;"></vk-data-verification-code>
					<!-- 验证码倒计时结束 -->
				</view>

			</view>
			<view class="login-btn">
				<button class="btn success circle" hover-class="hover" shape="circle" @click="loginBySms" :plain="false" :hair-line="false" type="success">注 册</button>
			</view>
			<!-- 底部信息 -->
			<view class="footer">
				<label>
					<checkbox-group @change="checkboxChange">
						<checkbox class="footer-checkbox" value="true" :checked="form1.agreement" active-color="#737373" shape="circle"></checkbox><text>同意</text>
					</checkbox-group>
				</label>
				
				<!-- 协议地址 -->
				<navigator url="" open-type="navigate" style="color: #007AFF;">《用户协议》</navigator>
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
					agreement:true,
					mobile:"",
					password:"",
					password2:"",
					code:"",
					type:"register"
				},
				scrollTop:0,
				isRotate:false,
				logoImage: "/static/logo.png",
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
			checkboxChange(e){
				let that = this;
				let value = e.detail.value || [];
				if (value.length > 0 && value[0]){
					that.form1.agreement = true;
				} else {
					that.form1.agreement = false;
				}
			},
			// 登录(手机号+验证码) 不存在会自动注册
			loginBySms() {
				let that = this;
				if(that.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				const { agreement, mobile, code, password, password2 } = that.form1;
				if(!agreement){
					vk.toast('请阅读并同意用户服务及隐私协议',"none");
					return;
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
				vk.userCenter.loginBySms({
					data:that.form1,
					success: (data) => {
						that.isRotate = false;
						if(data.type == "login"){
							vk.toast("登录成功!");
						}else{
							vk.toast("注册成功!");
						}
						setTimeout(() => {
							// 跳转到首页,或页面返回
							let pages = getCurrentPages();
							if(pages.length > 1){
								vk.navigateBack();
							}else{
								// 进入首页
								vk.navigateToHome();
							}
						},1000);
					},
					complete:() =>{
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
