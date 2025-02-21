<template>
	<view class="container">
		<Stage @onload="onload" :disableRaycaster="false">
			<view class="btn-container-top">
				<view class="btn" @click="loadModel">切换模型</view>
				<view class="btn" @click="playAnimation" v-if="currentModelId === 'RobotExpressive'">播放动画</view>
			</view>
			<view class="btn-container">
				<view class="btn" @click="changeMaterial('default')">默认</view>
				<view class="btn" @click="changeMaterial('white')">白色</view>
				<view class="btn" @click="changeMaterial('transparent')">透明</view>
				<view class="btn" @click="screenshot">截图</view>
			</view>
		</Stage>
	</view>
</template>

<script setup>
	import {
		ref,
	} from 'vue'


	import * as THREE from '@/components/threeJs/lib.js'
	import Stage from '@/components/threeJs/stage.vue'
	import {
		useThreeJs,
		traverse,
		events,
		animation
	} from '@/components/threeJs/index.js'

	const {
		getInstance, // 获取canvas、camera、等实例
		centerAndScale, // 用于调整模型大小和位置
		setEnv, // 设置环境贴图
		screenshot: _screenshot, // 截图

	} = useThreeJs()

	const scenes = {
		'default': null,
		'white': null,
		'transparent': null,
	}
	// 切换效果
	const changeMaterial = (key) => {
		Object.values(scenes).forEach(item => {
			traverse(item, (c => {
				c.visible = false
			}))
		})
		traverse(scenes[key], (c => {
			c.visible = true
		}))
	}
	// 截图
	const screenshot = async () => {
		uni.showLoading({
			title: 'loading'
		})
		const tempPath = await _screenshot()
		// #ifdef MP
		uni.saveImageToPhotosAlbum({
			filePath: tempPath
		})
		// #endif

		// #ifndef MP
		const a = document.createElement("a")
		a.href = tempPath
		a.download = 'image.png'
		a.click()
		// #endif
		uni.hideLoading()
	}

	// 播放模型自带动画
	let needReverse = false
	// https://threejs.org/docs/index.html?q=anim#api/zh/animation/AnimationAction
	const playAnimation = async () => {
		const activeModel = Object.values(scenes).filter(it => it.visible)[0]
		let time = Date.now()
		// Idle 是activeModel.animations中的子项的name
		await animation.play(activeModel, 'Idle', needReverse)
		console.log(Date.now() - time, 'ms')
		needReverse = !needReverse
	}


	const modelList = [{
			// 头盔
			id: 'DamagedHelmet',
			url: 'https://www.ccnihao.fun/public-resource/DamagedHelmet.gltf.glb'
		},
		{
			// 机器人
			id: "RobotExpressive",
			url: 'https://www.ccnihao.fun/public-resource/RobotExpressive.glb',
		}

	]
	const currentModelId = ref('DamagedHelmet');

	// 加载模型
	const initLight = (scene) => {
		scene.add(new THREE.AmbientLight(0xffffff, 0.2)) // 强度大于1会导致模型没有轮廓
		const directLight = new THREE.DirectionalLight(0xffffff, 0.5)
		scene.add(directLight)
		const hemiLight = new THREE.HemisphereLight(0x111122, 0x443333);
		scene.add(hemiLight);
	}
	const loadModel = async () => {
		let modelId = currentModelId.value == 'DamagedHelmet' ? 'RobotExpressive' : 'DamagedHelmet'
		currentModelId.value = modelId // 用于显示播放动画？
		const url = modelList.filter(it => it.id == modelId)[0].url
		const {
			group,
			loader,
			scene,
			controls
		} = getInstance()
		// 灯光只需要初始化一次
		// 这里用环境贴图就不加灯光了
		// initLight(scene)  
		controls.reset() // 重置视角
		// 需要展开，否则会有问题
		;
		[...group.children].forEach(c => { // 切换模型需要删除上一个模型
			c.removeFromParent()
			// group.remove(c)
		})


		// loader.load加载模型的时候第一个参数也可以传入buffer
		const getBuffer = async (url) => {
			const fs = uni.getFileSystemManager()
			return new Promise(r => {
				// 这样加载可以使用uni.downloadFile的返回值onProgressUpdate监听下载进度，具体可以看uniapp文档
				// 需要后台正确的设置Content-Length才会有进度
				// pc微信小程序下载模型好像有问题
				uni.downloadFile({
					url,
					success(res) {
						if (res.statusCode === 200) {
							const {
								tempFilePath
							} = res
							const buffer = fs.readFileSync(tempFilePath)
							r(buffer)
						}
					}
				})
			})
		}

		// 如果是.gltf+.bin+texture 请手动转成glb，相关nodejs代码可以参考使用说明
		// 这里可以传入url或者buffer
		// const buffer = await getBuffer(url)
		// let t = await loader.load(
		// 	"https://knew-wine.oss-cn-guangzhou.aliyuncs.com/uploads/user/2/20241221/20241221172142fa0737878.jpg",
		// 	null, 'texture')

		loader.load(url).then(gltf => {
			const s = gltf.scene
			// 三种效果
			scenes.default = s
			scenes.white = s.clone()
			scenes.transparent = s.clone()
			// 白色

			traverse(scenes.white, (c) => {
				if (c.isMesh) {

					c.material = new THREE.MeshStandardMaterial({
						color: '#ffffff',
						// map: t,
						envMapIntensity: 0.6,
					})
				}
			})
			// 透明
			traverse(scenes.transparent, (c) => {
				if (c.isMesh) {
					c.material = new THREE.MeshPhysicalMaterial({
						transparent: true,
						color: '#ffffff',
						opacity: 1,
						transmission: 1,
						metalness: 0,
						roughness: 0,
						envMapIntensity: 0.6,
						envMap: scene.environment,
						depthWrite: false, // 不设置false会出现噪面，在网页上使用threejs同版本没有问题
					})
				}
			})
			// 默认显示scenes.default
			Object.values(scenes).forEach(item => {
				traverse(item, (c) => {
					c.visible = false
				})
				group.add(item)
			})
			traverse(scenes.default, (c) => {
				c.visible = true
			})

			// 居中并缩放到合适的位置
			centerAndScale()

			// 点击命中我需要的模型部位
			const seleObj = ({
				object
			}) => {
				// 让模型闪一下红色
				if (object.userData?.active) return
				object.userData.active = true
				const m = object.material
				const activeColor = new THREE.Color(0xff0000)
				if (m.color.getHex() == activeColor.getHex()) { // 如果模型本身就是红色，那就闪绿色
					activeColor.set(0x00ff0f)
				}
				m.colorOld = m.color.getHex()
				setTimeout(() => {
					m.color.set(activeColor)
				}, 30)
				setTimeout(() => {
					m.color.set(m.colorOld)
					object.userData.active = false
				}, 800)

			}

			// 点击模型事件，我这里是点击机器人的眼睛
			// 第一个参数是个数组，每项是Object3D
			// 第二个参数是个回调，返回此次屏幕发出的射线所命中的mesh数组
			const remove = events.onClickMesh(group.children, (intersects) => {
				// 需要根据自己的业务逻辑来找到对应的mesh
				let isSele = false;
				// 注意：隐藏的模型还是可以命中的，即object.visible == false 也会被命中
				// 命中的都是mesh，你需要的可能是某个mesh的parent，根据自己的业务逻辑寻找
				for (let i = 0; i < intersects.length; i++) {
					const {
						object
					} = intersects[i]
					if (!object.visible) {
						continue
					}
					// 如果第一个不是隐藏的模型，不是眼镜就是没有点击到我要找的mesh
					if (!["Head_4"].includes(object
							.name)) {
						return
					}
					seleObj(intersects[i])
					if (isSele) break
				}
			})
		})
	}
	// 初始化完毕，开始设置环境贴图，并加载模型
	const onload = async () => {
		console.log('onload')
		const {
			renderer
		} = getInstance()
		// oppo find x8
		// THREE.WebGLRenderer: OES_texture_half_float extension not supported. supportsHalfFloatTextures

		// #ifdef MP
		const isSupport = renderer.supportsHalfFloatTextures()
		// #endif
		// #ifndef MP
		const isSupport = true
		// #endif	

		if (isSupport) {
			// 设置环境贴图，传入hdr文件在线地址即可,注意自己网页版跨域问题
			await setEnv('https://www.ccnihao.fun/public-resource/studio_small_09_1k.hdr', false)
		} else {
			await setEnv('https://www.ccnihao.fun/public-resource/de_balie-compress.jpg', false)
		}

		// 加载模型逻辑
		loadModel()
	}
</script>

<style lang="scss">
	.container {
		width: 100vw;
		height: 100vh;
	}

	.btn-container-top {
		position: fixed;
		top: 10%;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		justify-content: center;

	}

	.btn-container {
		position: fixed;
		bottom: 10%;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		justify-content: center;

	}

	.btn {
		padding: 0 30rpx;
		margin: 0 20rpx;
		border: 1px solid black;
		border-radius: 10rpx;
		white-space: nowrap;
	}
</style>