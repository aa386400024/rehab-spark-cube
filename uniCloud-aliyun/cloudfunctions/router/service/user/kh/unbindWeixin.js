module.exports = {
	/**
	 * 解绑微信
	 * @url user/kh/unbindWeixin 前端调用的url参数地址
	 * @description 当前登录用户解绑微信
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		// 业务逻辑开始-----------------------------------------------------------
		let { data = {}, userInfo, util, originalParam } = event;
		let { uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: '' };

		let {
			appid, // 需要解绑的appid，不传则解绑所有
		} = data

		// 标记当前平台的provider
		const provider = "wx"; // 历史原因，这里用wx，而非weixin
		const providerName = "微信";

		// 以下代码一般不需要更改-----------------------------------------------------------
		// 以下代码一般不需要更改-----------------------------------------------------------
		// 以下代码一般不需要更改-----------------------------------------------------------
		const loginUtil = vk.require("service/user/util/loginUtil");
		res = await loginUtil.unbind({
			userInfo,
			provider,
			providerName,
			appid
		}, util);
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}