<template>
	<view class="text-input-card">
		<!-- 显示问题的标题 -->
		<label class="question-label">
			{{ question.label }}
		</label>
		<!-- 显示用户可填写的输入框 -->
		<input class="input-field" :placeholder="question.placeholder" v-model="answer" @input="emitAnswer" />
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue";
	const props = defineProps({
		question: {
			type: Object, // 必须传入一个对象类型的问题数据
			required: true // 必须传递，否则会报错
		}
	});

	const answer = ref(""); // 本地输入框的内容w

	// 3. Emit：向父组件通知用户输入的内容
	const emit = defineEmits(["onAnswer"]);

	const emitAnswer = () => {
		// 每当用户输入时，将回答的内容通过事件向父组件传递
		emit("onAnswer", answer.value);
	};
</script>

<style scoped>
	.text-input-card {
		margin-bottom: 16px;
	}

	.question-label {
		display: block;
		margin-bottom: 8px;
		font-size: 14px;
		color: #333;
		/* 字体颜色 */
	}

	.input-field {
		width: 100%;
		/* 填充父容器宽度 */
		height: 40px;
		/* 输入框高度 */
		padding: 8px;
		/* 内边距 */
		font-size: 14px;
		/* 字体尺寸 */
		border: 1px solid #ccc;
		/* 边框颜色 */
		border-radius: 4px;
		/* 圆角 */
	}
</style>