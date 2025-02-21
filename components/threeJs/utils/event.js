import * as THREE from 'three'
import {
	useThreeJs
} from '../index.js'

//声明raycaster和mouse变量
const raycaster = new THREE.Raycaster()
// 屏幕坐标转成threejs坐标
const mouse = new THREE.Vector2()

const {
	getInstance,
	getContainerSize
} = useThreeJs()

class Events extends THREE.EventDispatcher {
	static events = {
		CLICK_MESH: 'CLICK_MESH'
	}

	static functions = []

	constructor() {
		super()
		this.enabled = true
		this.onEvent()
	}

	// 初始化监听
	onEvent(event) {
		if (!this.enabled) return
		this.dispatchEvent({
			type: Events.events.CLICK_MESH,
			data: {
				event
			}
		})
	}

	// 清空的单个监听
	removeEvent(name, fn) {
		this.removeEventListener(name, fn)
		let index = Events.functions.findIndex((item) => item.fn === fn)
		if (index !== -1) Events.functions.slice(index, 1)
	}

	// 销毁清空
	removeEvents() {
		Events.functions.forEach((item) => {
			this.removeEvent(item.name, item.fn)
		})
		Events.functions = []
	}


	// 绑定监听
	onClickMesh(meshList = [], callback = (intersects, remove) => {}, once = false) {
		const {
			camera,
			canvas,
		} = getInstance()

		const {
			width,
			height
		} = getContainerSize()

		const fn = ({
			data
		}) => {
			const {
				event
			} = data
			const [touchEvent] = event.touches

			// 一切都是基于canvas是全屏状态
			mouse.x = (touchEvent.clientX / width) * 2 - 1
			mouse.y = -(touchEvent.clientY / height) * 2 + 1

			// 否则参考网页版写法，无法直接使用
			// 
			// 	const rect = canvas.getBoundingClientRect()
			// 	const offsetX = rect.left
			// 	const offsetY = rect.top
			// 	mouse.x = ((event.clientX - offsetX) / (rect.right - offsetX)) * 2 - 1
			// 	mouse.y = -((event.clientY - offsetY) / (rect.bottom - offsetY)) * 2 + 1
			// 

			raycaster.setFromCamera(mouse, camera)
			const intersects = raycaster.intersectObjects(meshList)
			callback(intersects, this.removeEvent.bind(this, Events.events.CLICK_MESH, fn))
			if (intersects.length > 0 && once) {
				this.removeEvent(Events.events.CLICK_MESH, fn)
			}
		}

		Events.functions.push({
			name: Events.events.CLICK_MESH,
			fn
		})
		this.addEventListener(Events.events.CLICK_MESH, fn)
		return this.removeEvent.bind(this, Events.events.CLICK_MESH, fn)
	}






}

export const events = new Events()