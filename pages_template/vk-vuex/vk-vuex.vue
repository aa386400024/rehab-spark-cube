<template>
	<view class="content">
		<view>
			Vuex可以用来做全局状态管理。
			而此例子是演示将当前登录用户信息存入Vuex，以便于在其他页面中也能直接渲染或获取用户信息
		</view>
		<view style="margin-top: 10rpx;">
			说明:
			<view style="margin-top: 10rpx;">
				1、<text>$user</text> 对应 store/modules 目录下的js文件<br/>
				以下两个方式均可以对 vuex 数据进行操作<br/><br/>
				方式一：<br/>
				获取 Vuex 数据：<br/>
				vk.getVuex('$user.userInfo')<br/>
				更新 Vuex 数据：<br/>
				vk.setVuex('$user.userInfo.avatar', avatar)<br/><br/>

				方式二：<br/>
				获取 Vuex 数据：<br/>
				vk.vuex.get('$user.userInfo')<br/>
				更新 Vuex 数据：<br/>
				vk.vuex.set('$user.userInfo.avatar', avatar);<br/>
				触发 Vuex action：<br/>
				vk.vuex.dispatch('$user/addFootprint', data);<br/>

			</view>
		</view>
		<view v-if="vk.getVuex('$user.userInfo._id')" style="color: red;margin-top: 10rpx;font-size: 36rpx;">
			当前登录用户：{{ vk.getVuex('$user.userInfo.nickname') || vk.getVuex('$user.userInfo.username') }}
			<image :src="vk.getVuex('$user.userInfo.avatar')" style="width: 70rpx;height: 70rpx;border-radius: 50%;" mode="aspectFill"></image>
		</view>
		<view style="margin-top: 20rpx;">
			<input type="text" v-model="form1.username" placeholder="用户名/邮箱/手机号" />
			<input type="text" v-model="form1.password" password="true" placeholder="密码" />
			<button type="default" @tap="register">注册</button>
			<button type="default" @tap="login">登录</button>
			<button type="default" @tap="uploadAvatar">上传到云储存(并设置为头像)</button>
			<button type="default" @tap="logout">退出</button>
		</view>
	</view>
</template>

<script>
	let vk = uni.vk;
	export default {
		data() {
			return {
				form1:{
					username: 'admin',
					password: '123456'
				}
			}
		},
		onLoad(options) {
			vk = uni.vk;
		},
		methods: {
			// 用户注册
			register(){
				let form1 = this.form1;
				vk.userCenter.register({
					data:form1,
					success: (data) => {
						vk.alert("注册成功!");
					}
				});
			},
			// 用户登录
			login(){
				let form1 = this.form1;
				vk.userCenter.login({
					data:form1,
					success: (data) => {
						// 登录成功后将用户信息写入$store
						vk.setVuex('$user.userInfo', data.userInfo);
						vk.alert("登录成功!");
					}
				});
			},
			// 退出
			logout(){
				vk.userCenter.logout({
					success: (data) => {
						// 退出成功后清楚$store的用户信息
						vk.setVuex('$user.userInfo', {});
						vk.alert("退出成功");
					}
				});
			},
			// 上传头像到云储存,并设置为头像
			uploadAvatar(){
				// 选择图片
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: (res) => {
						// 上传图片到云储存
						vk.uploadFile({
							title:"上传中...",
							filePath: res.tempFilePaths[0],
							fileType: "image",
							success(res) {
								// 执行绑定头像
								vk.userCenter.setAvatar({
									data: {
										avatar: res.url,
									},
									success() {
										// 修改Vuex用户状态
										vk.setVuex('$user.userInfo.avatar', res.url);
									}
								});
							}
						});
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
	.content {
		padding: 15px;
		font-size: 28rpx;
		color: #303133;
	}
	.content input {
		height: 46px;
		border: solid 1px #DDDDDD;
		border-radius: 5px;
		margin-bottom: 15px;
		padding: 0px 15px;
		display: block;
	}
	.content button {
		margin-bottom: 15px;
	}
	.content navigator {
		display: inline-block;
		color: #007AFF;
		border-bottom: solid 1px #007AFF;
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
