import * as THREE from '../lib.js'
import {
	GLTFLoader,
	RGBELoader
} from '../lib.js'
// import {
// 	MeshoptDecoder
// } from 'three-platformize/examples/jsm/libs/meshopt_decoder.module.js';

import {
	animation,
	initAnimation
} from './animation'

import {
	onUnmounted
} from 'vue'




// const gltfLoader = new GLTFLoader()
// gltfLoader.setMeshoptDecoder(MeshoptDecoder);
// 这两行需要在PLATFORM.set 设置后执行
export const initLoader = (isInit) => {
	const gltfLoader = new GLTFLoader()
	// gltfLoader.setMeshoptDecoder(MeshoptDecoder);



	// 加载glb模型,url 是资源在线地址或者buffer
	const loadGlb = (url, callback = () => {}) => {
		// 如果传入的url不是string会被当成buffer看待
		const isArrayBuffer = typeof url !== 'string'
		return new Promise(async (resolve, reject) => {
			try {
				if (isArrayBuffer) {
					gltfLoader.parse(url, "", (gltf) => {
						initAnimation(gltf)
						callback && callback(gltf)
						resolve(gltf)
					}, (err) => {
						reject(err)
					})
				} else {
					const gltf = await gltfLoader.loadAsync(url)
					initAnimation(gltf)
					callback && callback(gltf)
					resolve(gltf)
				}

			} catch (error) {
				reject(error)
			}

		})
	}

	// 加载hdr
	const loadHdr = async (url, callback) => {
		return new Promise((resolve, reject) => {
			new RGBELoader().load(url, texture => {
				texture.mapping = THREE.EquirectangularReflectionMapping;
				callback && callback(texture)
				resolve(texture)
			}, null, err => reject(err))
		})
	}
	// 加载普通图片
	const loadTexture = async (url, callback) => {
		return new Promise((resolve, reject) => {
			new THREE.TextureLoader().load(url, texture => {
				texture.minFilter = THREE.LinearFilter
				texture.mapping = THREE.EquirectangularReflectionMapping;
				callback && callback(texture)
				resolve(texture)
			}, null, err => reject(err))
		})
	}


	const load = async (url, callback = () => {}, resType = 'glb') => {
		switch (resType) {
			case 'glb':
				return loadGlb(url, callback)
				break;
			case 'hdr':
				return loadHdr(url, callback)
				break;
			case 'texture':
				return loadTexture(url, callback)
				break
			default:
				throw new Error(`暂不支持${resType}格式`)
				break;
		}
	}

	const setPath = (path) => {
		gltfLoader.setPath(path)
	}

	return {
		load,
		setPath
	}
}