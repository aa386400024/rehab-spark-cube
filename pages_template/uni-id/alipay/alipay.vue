<template>
	<view class="content">
		<button type="default" @click="loginByAlipay('register')">支付宝注册</button>
		<button type="default" @click="loginByAlipay('login')">支付宝登录</button>
		<button type="default" @click="loginByAlipay()">支付宝登录(不存在自动注册)</button>
		<button type="default" @click="code2SessionAlipay">获取支付宝openid</button>
		<button type="default" @click="bindAlipay">绑定支付宝</button>
		<button type="default" @click="unbindAlipay">解绑支付宝</button>
	</view>
</template>

<script>
	let vk = uni.vk;
	export default {
		data() {
			return {};
		},
		onLoad(options) {
			vk = uni.vk;
		},
		methods: {
			// 支付宝登录
			loginByAlipay(type) {
				vk.userCenter.loginByAlipay({
					data: {
						type
					},
					success: data => {
						vk.alert("登录成功");
					}
				});
			},
			// 获取支付宝openid
			code2SessionAlipay() {
				vk.userCenter.code2SessionAlipay({
					success: data => {
						vk.alert(JSON.stringify(data));
					}
				});
			},
			// 绑定支付宝
			bindAlipay() {
				vk.userCenter.bindAlipay({
					success: data => {
						vk.alert("绑定成功");
					}
				});
			},
			// 解绑支付宝
			unbindAlipay() {
				vk.userCenter.unbindAlipay({
					success: data => {
						vk.alert("解绑成功");
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.content {
		padding: 15px;
	}

	.content input {
		height: 46px;
		border: solid 1px #dddddd;
		border-radius: 5px;
		margin-bottom: 15px;
		padding: 0px 15px;
	}

	.content button {
		margin-bottom: 15px;
	}

	.content navigator {
		display: inline-block;
		color: #007aff;
		border-bottom: solid 1px #007aff;
		font-size: 16px;
		line-height: 24px;
		margin-bottom: 15px;
	}

	.tips {
		text-align: center;
		line-height: 20px;
		font-size: 14px;
		color: #999999;
		margin-bottom: 20px;
	}
</style>