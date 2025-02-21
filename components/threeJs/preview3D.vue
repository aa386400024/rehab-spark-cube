<template>
	<div class="w-full h-full relative">
		<!-- #ifdef APP -->
		<!-- app建议自己写逻辑，因为是renderjs的方式，调用方法很麻烦，自己写逻辑可以在template中直接调用renderjs中的方法 -->
		<StageApp v-bind="$props" @loaded="loaded" :playOptions="playOptions"></StageApp>
		<!-- #endif -->

		<!-- #ifndef APP -->
		<Stage @onload="onload"></Stage>
		<!-- #endif -->
	</div>
</template>

<script>
	// #ifdef APP
	import StageApp from './stageApp.vue'
	// #endif	

	// #ifndef APP
	import Stage from './stage.vue'
	import * as THREE from './lib.js'
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
	// #endif

	export default {
		name: 'preview3D',
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
		},

		components: {
			// #ifndef APP
			Stage,
			// #endif
			// #ifdef APP
			StageApp
			// #endif
		},
		// #ifndef APP
		watch: {
			'modelurl': {
				handler() {
					this.loadModel()
				}
			},
			'autoRotate': {
				handler(val) {
					this.update()
				}
			},
			'autoRotateSpeed': {
				handler(val) {
					this.update()

				}
			},
		},
		// #endif
		data() {
			return {
				playOptions: {},
			}
		},
		methods: {
			update() {
				const {
					controls
				} = getInstance()
				controls.autoRotateSpeed = this.autoRotateSpeed
				controls.autoRotate = this.autoRotate
			},
			loaded() {
				this.$emit('loaded')
			},
			// 非app端，场景初始化完毕
			async onload() {
				// 设置环境贴图
				const {
					backgroundVisible,
					env
				} = this.$props
				setEnv(env, backgroundVisible)
				this.loadModel()
				this.update()
			},
			// 加载模型
			async loadModel() {
				const {
					modelurl,
					scale
				} = this.$props
				const {
					group,
					loader,
					scene,
					controls
				} = getInstance()
				controls.reset() // 重置视角

				;
				[...group.children].forEach(c => { // 切换模型需要删除上一个模型
					c.removeFromParent()
					// group.remove(c)
				})


				const glb = await loader.load(modelurl)
				group.add(glb.scene)
				centerAndScale(scale)

				this.loaded()
			},
			async play(animationName, needReverse = false, attr = {}) {
				// #ifndef APP
				const {
					group,
				} = getInstance()
				const [model] = [...group.children]
				await animation.play(model, animationName, needReverse, attr)
				// #endif

				// #ifdef APP
				this.playOptions = {
					animationName,
					needReverse,
					attr
				}

				this.$nextTick(() => {
					this.playOptions = {}
				})
				// #endif

			},
		},
		mounted() {
			// 
		}
	}
</script>


<style lang="scss" scoped>
	.w-full {
		width: 100%;
	}

	.h-full {
		height: 100%;
	}

	.relative {
		position: relative;
	}
</style>