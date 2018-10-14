window.app = {
	
	/**
	 * 后端服务发布的URL地址,这边要用本机真实IP地址
	 */
	serverUrl : 'http://192.168.23.1:8080',
	
	/**
	 * 图片服务器地址,lwh是group名
	 */
	imgServerUrl : "http://192.168.128.129:88/lwh/",
	
	/**
	 * 判读字符串是否为空
	 * @param {Object} str
	 */
	isNotNull : function(str){
		if(str != null && str != "" && str != undefined){
			return true;
		}
		return false;
	},
	
	/**
	 * 封装消息提示框,默认MUI的不支持居中和自定义icon,所以使用H5+
	 * @param {Object} msg
	 * @param {Object} type
	 */
	showToast : function(msg, type){
		plus.nativeUI.toast(msg, 
			{icon: "image/" + type + ".png", verticalAlign: "center"})
	},
	
	/**
	 * 保存用户的全局对象
	 * @param {Object} user
	 */
	setUserGlobalInfo : function(user){
		var userInfoStr = JSON.stringify(user);
		plus.storage.setItem("userInfo", userInfoStr);
	},
	
	/**
	 * 获取用户的全局对象
	 */
	getUserGlobalInfo : function(){
		var userInfoStr = plus.storage.getItem("userInfo");
		return JSON.parse(userInfoStr);
	},
	
	/**
	 * 用户退出登录,移除用户全局对象
	 */
	userLogout : function(){
		plus.storage.removeItem("userInfo");
	}
	
}
