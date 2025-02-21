<template>
	<view class="w-full h-full relative" :prop="$props" :change:prop="three.init">
		<div id='container' class="w-full h-full">
		</div>
		<!-- 自己写逻辑可以这样调用方法比较方便。 -->
		<!-- <button @click="three.xxx"></button> -->
	</view>
</template>

<script>
	export default {
		props: {
			// 模型链接
			modelurl: {
				type: String,
				default: ''
			},
			// 环境贴图链接
			env: {
				type: String,
				default: ''
			},
			// 环境贴图是否可见
			backgroundVisible: {
				type: Boolean,
				default: false
			},
			// 模型缩放比例
			scale: {
				type: Number,
				default: 0.6
			},
			// 模型自动旋转
			autoRotate: {
				type: Boolean,
				default: false
			},
			// 自动旋转速度
			autoRotateSpeed: {
				type: Number,
				default: 1.6
			},
			// 用于执行一些渲染层的方法
			playOptions: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {}
		},
		mounted() {},
		methods: {
			loaded() {
				this.$emit('loaded')
			},
		},
	}
</script>
<script module="three" lang="renderjs">
	const instance = {}
	import * as THREE from 'three'
	import {
		OrbitControls
	} from 'three/examples/jsm/controls/OrbitControls.js'
	import {
		GLTFLoader
	} from 'three/examples/jsm/loaders/GLTFLoader.js'
	import {
		RGBELoader
	} from 'three/examples/jsm/loaders/RGBELoader.js'

	import {
		animation,
		initAnimation
	} from './utils/animation.js'


	export default {
		data() {
			this.frameId = 0
			return {
				isInit: false,
				props: {}
			}
		},
		mounted() {

		},



		computed: {

		},
		methods: {
			// 貌似不需要销毁，会自动销毁相关变量
			// 因为退出页面requestAnimationFrame不会在执行了
			destroy() {
				cancelAnimationFrame(this.frameId)
				animation.dispose()
				const {
					group,
					scene,
					renderer
				} = instacen
				try {
					group.traverse(c => {
						if (c.isMesh) {
							c.geometry.dispose();
							c.material.dispose();
						}
						if (c.isTexture) {
							c.dispose();
						}
					})

					scene.traverse(c => {
						if (c.parent) {
							c.parent.remove(c);
						}
					})
					for (let i = scene.children.length - 1; i >= 0; i--) {
						scene.remove(scene.children[i]);
					}

					scene.clear();
					renderer.dispose();
					renderer.forceContextLoss();
					renderer.content = null;

					for (const key in instance) {
						instance[key] = null
					}
					console.log('场景销毁')
				} catch (error) {
					//TODO handle the exception
					console.log('dispose error:', error)
				}
			},
			// 居中和缩放模型，在模型加载之后执行
			centerAndScale(scaleRatio = 0.6) {
				const {
					group,
					camera,
					scene
				} = instance

				group.position.set(0, 0, 0) // 需要复位一下，否则切换模型位置会不对
				group.scale.set(1, 1, 1) // 需要复位一下，否则切换模型位置会不对

				const boundingBox = new THREE.Box3().setFromObject(group);

				// const helper = new THREE.Box3Helper( boundingBox, 0xffff00 );
				// scene.add(helper)

				// 缩放
				// let scaleRatio = 0.6 // 模型最大边（高度或者宽度）占据屏幕的60%

				// 获取模型的边界框来确定其尺寸
				const modelSize = boundingBox.getSize(new THREE.Vector3());

				// 计算模型的高宽比
				const aspectRatio = modelSize.y / modelSize.x;

				// 计算相机视锥体的垂直高度（基于相机FOV和距离）
				// const fov = THREE.Math.degToRad(camera.fov); // 将FOV转换为弧度
				const fov = camera.fov * (Math.PI / 180);
				const cameraDistance = camera.position.length(); // 相机到模型的距离（假设相机在z轴上）
				const viewHeight = 2 * Math.tan(fov / 2) * cameraDistance; // 视锥体垂直高度
				// 由于我们使用的是相机的宽高比，我们不需要计算viewWidth，因为viewWidth = viewHeight * camera.aspect
				const viewWidth = viewHeight * camera.aspect;
				// 计算缩放比例
				let scale = 1;
				if (aspectRatio > 1) {
					// 模型高度占主导，缩放以适应视锥体的高度
					scale = viewHeight / modelSize.y * scaleRatio;
					// 检查按高度缩放后的宽度是否超出视锥体宽度
					const scaledWidth = modelSize.x * scale;
					const offset = 1 - scaleRatio
					if (scaledWidth > viewWidth - offset) {
						// 如果超出，计算超出的差值重新计算比例
						const ratio = (scaledWidth - viewWidth) / scaledWidth
						scale -= ratio * scale + 0.2 * scale
					}

				} else {
					// 如果是宽度大于高度的模型，在手机上可以放大scaleRatio
					// scaleRatio = 0.8
					scaleRatio = scaleRatio * 1.3
					// 模型宽度占主导，但由于我们使用的是相机的宽高比
					scale = viewWidth / modelSize.x * scaleRatio;


					// 检查按宽度缩放后的高度是否超出视锥体高度
					const scaledHeight = modelSize.y * scale;
					const offset = 1 - scaleRatio
					if (scaledHeight > viewHeight - offset) {
						// 如果超出，计算超出的差值重新计算比例
						const ratio = (scaledHeight - viewHeight) / scaledHeight
						scale -= ratio * scale + 0.2 * scale
						// 如果超出，则根据高度重新计算缩放比例
					}
				}

				const scaledWidth = modelSize.x * scale;
				const scaledHeight = modelSize.y * scale;

				// 应用缩放
				group.scale.set(scale, scale, scale);

				// 居中
				const center = new THREE.Vector3()
				boundingBox.getCenter(center)
				// 重新设置模型的位置，使之居中
				group.position.sub(center).multiplyScalar(scale);
			},
			setEnv() {
				const {
					backgroundVisible,
					env,
				} = this.props
				const rgbeLoader = new RGBELoader()
				rgbeLoader.load(env, texture => {
					texture.mapping = THREE.EquirectangularReflectionMapping;
					instance.scene.environment = texture
					if (backgroundVisible) instance.scene.background = texture
				})
			},
			loadModel() {
				const {
					modelurl,
					scale
				} = this.props

				const {
					controls,
					group
				} = instance
				controls.reset() // 重置视角

				;
				[...group.children].forEach(c => { // 切换模型需要删除上一个模型
					c.removeFromParent()
					// group.remove(c)
				})

				const loader = new GLTFLoader()
				loader.load(modelurl, res => {
					initAnimation(res)
					group.add(res.scene)
					this.centerAndScale(scale)
					this.$ownerInstance.callMethod('loaded')
				})
			},
			async playAnimation({
				animationName,
				needReverse = false,
				attr = {}
			}) {
				const {
					group,
				} = instance
				const [model] = [...group.children]
				await animation.play(model, animationName, needReverse, attr)
			},
			update() {
				if (!Object.keys(instance).length) {
					return
				}
				const {
					props
				} = this;
				const {
					controls
				} = instance
				controls.autoRotate = props.autoRotate;
				controls.autoRotateSpeed = props.autoRotateSpeed
			},
			init(props) {
				if (this.isInit) {
					// 播放动画
					if (!!props.playOptions?.animationName) {
						this.playAnimation(props.playOptions)
						return
					}
					// 切换模型
					if (props.modelurl && props.modelurl !== this.props.modelurl) {
						this.props = props
						this.loadModel()
					}
					this.update()
					return
				}
				this.isInit = true
				this.props = props
				const container = document.querySelector('#container')
				let {
					width,
					height
				} = container.getBoundingClientRect()
				const renderer = new THREE.WebGLRenderer({
					preserveDrawingBuffer: true, // 设置 canvas 可toDataURL
					antialias: true,
					alpha: true,
					logarithmicDepthBuffer: true
				})

				renderer.toneMapping = THREE.ACESFilmicToneMapping;
				renderer.toneMappingExposure = 1
				// 如果使用133版本需要修改SRGBColorSpace
				renderer.outputEncoding = THREE.SRGBColorSpace

				renderer.setSize(width, height)
				renderer.setPixelRatio(2)
				container.appendChild(renderer.domElement)

				const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
				camera.position.z = 10
				const scene = new THREE.Scene()
				// 微信开发工具canvas层级显示有问题，真机没问题
				// scene.background = new THREE.Color('#f2f2f2')
				const clock = new THREE.Clock();
				const group = new THREE.Group()
				group.name = 'main-group'
				scene.add(group)

				const controls = new OrbitControls(camera, renderer.domElement);
				controls.enablePan = false // 禁止平移摄像机
				controls.enableDamping = true //惯性
				controls.autoRotate = props.autoRotate;
				controls.autoRotateSpeed = props.autoRotateSpeed

				Object.assign(instance, {
					container, // canvas 父容器
					camera,
					scene,
					clock,
					group,
					renderer,
					controls,
				})

				const render = () => {
					controls.update()
					renderer.render(scene, camera);
				}

				const animate = () => {
					const t = clock.getDelta()
					animation.update(t)
					this.frameId = requestAnimationFrame(animate)
					render()
				}
				animate()
				this.setEnv()
				this.loadModel()
			},
		},
	}
</script>




<style lang="scss">
	.w-full {
		width: 100%
	}

	.h-full {
		height: 100%;
	}

	.relative {
		position: relative;
	}

	.fixed {
		position: fixed;
	}

	.left-99999 {
		left: 99999;
	}

	.opacity-0 {
		opacity: 0;
	}
</style>