import {
	ref,
	computed
} from 'vue'


import * as THREE from '../lib'
// import * as THREE from 'three-platformize'
import {
	screenshot as shot
} from 'three-platformize/tools/screenshot'
import {
	initLoader
} from './loader.js'

const isInit = ref(false)
const instance = {
	canvas: null, // 渲染模型的canvas
	helperCanvas: null, // 用于截图的canvas
	camera: null,
	scene: null,
	clock: null,
	group: null,
	renderer: null,
	controls: null,
	loader: null
}

const loopFuncs = []
let uid = 1;

const useLoop = (cb = () => {}) => {
	const funcId = ++uid;
	const stop = () => {
		loopFuncs.splice(
			loopFuncs.findIndex((item) => item.id === funcId),
			1
		)
	}
	loopFuncs.push({
		id: funcId,
		cb
	})

	return {
		loopFuncs,
		funcId,
		stop,
	}
}

const getInstance = () => {
	return {
		...instance
	}
}


const initThreeJs = (inst = {}) => {
	Object.assign(instance, inst)
	instance.loader = initLoader(isInit)
	isInit.value = true
}

// 居中和缩放模型，在模型加载之后执行
const centerAndScale = (scaleRatio = 0.6) => {
	const {
		group,
		camera,
		scene
	} = getInstance()

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
}

export const traverse = (g, cb = () => {}) => {
	if (!g?.isScene) {
		cb(g)
	}

	if (g.children && g.children.length) {
		g.children.forEach(c => {
			traverse(c, cb)
		})
	}
}
const dispose = () => {
	if (!isInit.value) {
		console.log('未初始化无需销毁场景')
		return
	}


	const {
		scene,
		renderer
	} = instance;
	isInit.value = false;
	loopFuncs.length = 0;

	try {
		traverse(scene, (c) => {
			if (c.isMesh) {
				c.geometry.dispose();
				c.material.dispose();
			}
			if (c.isTexture) {
				c.dispose();
			}
		})
		traverse(scene, (c) => {
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

}


// 设置环境贴图，传入在线地址即可
function getFileExtension(url) {
	// 找到最后一个点的位置
	const lastDotIndex = url.lastIndexOf('.');
	// 如果没有点，说明没有后缀，返回空字符串
	if (lastDotIndex === -1) {
		return '';
	}
	// 截取从最后一个点到字符串末尾的部分
	const extension = url.substring(lastDotIndex + 1);
	return extension;
}
const setEnv = async (url, isSetBg = true) => {
	const {
		scene,
		loader
	} = getInstance()
	return new Promise((resolve, reject) => {
		const ext = getFileExtension(url)
		if (ext === 'hdr') {
			loader.load(url, (texture) => {
				texture.mapping = THREE.EquirectangularReflectionMapping;
				scene.environment = texture
				if (isSetBg) scene.background = texture
				resolve(texture)
			}, 'hdr')
		} else {
			// 图片格式走这里
			loader.load(url, texture => {
				texture.minFilter = THREE.LinearFilter
				texture.mapping = THREE.EquirectangularReflectionMapping;
				scene.environment = texture
				if (isSetBg) scene.background = texture
				resolve(texture)
			}, 'texture')

		}
	})
}

// 截图,MP专用
// 使用方法
// const tempPath = await screenshot()
// uni.saveImageToPhotosAlbum({
// 	filePath:tempPath
// })
// #ifdef MP
const screenshot = async () => {
	const {
		scene,
		renderer,
		camera,
		helperCanvas
	} = getInstance()

	const [data, w, h] = shot(renderer, scene, camera, THREE.WebGLRenderTarget);
	const ctx = helperCanvas.getContext('2d')
	const imgData = helperCanvas.createImageData(data, w, h);
	helperCanvas.height = imgData.height;
	helperCanvas.width = imgData.width;
	ctx.putImageData(imgData, 0, 0);
	// const imgDataFromCanvas = ctx.getImageData(0, 0, w, h)
	// const hasPixel = imgDataFromCanvas.data.some(i => i !== 0)
	// console.log('hasPixel', hasPixel)

	return new Promise((resolve, reject) => {
		uni.canvasToTempFilePath({
			canvas: helperCanvas,
			success(res) {
				resolve(res.tempFilePath)
			},
			fail(err) {
				reject(err)
			}
		})
	})
}
// #endif
// app、h5
// #ifndef MP
const screenshot = async () => {
	const {
		renderer,
	} = getInstance()

	return new Promise((resolve, reject) => {
		const canvas = renderer.domElement
		const url = canvas.toDataURL('image/png')
		resolve(url)
	})

}

// #endif



// 获取容器尺寸

const getContainerSize = () => {
	const {
		canvas,
		container
	} = getInstance()
	// #ifdef MP
	const {
		width,
		height
	} = canvas
	// #endif

	// #ifndef MP
	const {
		width,
		height
	} = container.value.getBoundingClientRect()
	// #endif


	return {
		width,
		height
	}


}





export function useThreeJs() {
	return {
		centerAndScale,
		useLoop,
		loopFuncs,
		initThreeJs,
		isInit,
		dispose,
		getInstance,
		setEnv,
		screenshot,
		getContainerSize,
	}
}