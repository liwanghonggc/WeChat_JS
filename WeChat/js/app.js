window.app = {
	
	/**
	 * Netty服务的URL
	 */
	nettyServerUrl : 'ws://192.168.23.1:8088/ws',
	
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
	},
	
	/**
	 * 保存用户的联系人列表
	 * @param {Object} contactList
	 */
	setContactList : function(contactList){
		var contactListStr = JSON.stringify(contactList);
		plus.storage.setItem("contactList", contactListStr);
	},
	
	/**
	 * 获取联系人列表
	 */
	getContactList : function(){
		var contactListStr = plus.storage.getItem("contactList");
		if(!this.isNotNull(contactListStr)){
			return [];
		}
		
		return JSON.parse(contactListStr);
	},
	
	/**
	 * 和后端的枚举对应
	 */
	CONNECT : 1, // "第一次(或重连)初始化连接"
	CHAT : 2,  //"聊天消息"	
	SIGNED : 3, //"消息签收"
	KEEPALIVE : 4, //"客户端保持心跳"
	PULL_FRIEND : 5, //"拉取好友"
	
	/**
	 * 和后端的ChatMsg聊天模型对象保持一致
	 * @param {Object} senderId
	 * @param {Object} receiveId
	 * @param {Object} msg
	 * @param {Object} msgId
	 */
	ChatMsg : function(senderId, receiveId, msg, msgId){
		this.senderId = senderId;
		this.receiveId = receiveId;
		this.msg = msg;
		this.msgId = msgId;
	},
	
	/**
	 * 构建消息模型对象
	 * @param {Object} action
	 * @param {Object} chatMsg
	 * @param {Object} extend
	 */
	DataContent : function(action, chatMsg, extend){
		this.action = action;
		this.chatMsg = chatMsg;
		this.extend = extend;
	}
}
