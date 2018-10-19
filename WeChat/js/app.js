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
	},
	
	/**
	 * 单个聊天记录的对象
	 * @param {Object} myId
	 * @param {Object} friendId
	 * @param {Object} msg
	 * @param {Object} flag
	 */
	ChatHistory : function(myId, friendId, msg, flag){
		this.myId = myId;
		this.friendId = friendId;
		this.msg = msg;
		this.flag = flag;
	},
	
	/**
	 * 消息快照对象
	 * @param {Object} myId
	 * @param {Object} friendId
	 * @param {Object} msg
	 * @param {Object} isRead 用于判断消息已读未读
	 */
	ChatSnapshot : function(myId, friendId, msg, isRead){
		this.myId = myId;
		this.friendId = friendId;
		this.msg = msg;
		this.isRead = isRead;
	},
	
	/**
	 * 用于保存用户的聊天记录
	 * @param {Object} myId
	 * @param {Object} friendId
	 * @param {Object} msg
	 * @param {Object} flag 判断消息是我发送的还是朋友发送的 1我发送 2朋友发送
	 */
	saveUserChatHistory : function(myId, friendId, msg, flag){
		var me = this;
		var chatKey = "chat-" + myId + "-" + friendId;
		
		//从本地缓存获取聊天记录是否存在
		var chatHistoryListStr = plus.storage.getItem(chatKey);
		var chatHistoryList;
		
		if(me.isNotNull(chatHistoryListStr)){
			chatHistoryList = JSON.parse(chatHistoryListStr);
		}else{
			chatHistoryList = [];
		}
		
		//构建聊天记录对象
		var singleMsg = new me.ChatHistory(myId, friendId, msg, flag);
		
		//向list中追加msg对象并保存到缓存
		chatHistoryList.push(singleMsg);
		plus.storage.setItem(chatKey, JSON.stringify(chatHistoryList));
		
	},
	
	/**
	 * 获取用户聊天记录
	 * @param {Object} myId
	 * @param {Object} friendId
	 */
	getUserChatHistory : function(myId, friendId){
		var me = this;
		var chatKey = "chat-" + myId + "-" + friendId;
		
		//从本地缓存获取聊天记录是否存在
		var chatHistoryListStr = plus.storage.getItem(chatKey);
		var chatHistoryList;
		
		if(me.isNotNull(chatHistoryListStr)){
			chatHistoryList = JSON.parse(chatHistoryListStr);
		}else{
			chatHistoryList = [];
		}
		
		return chatHistoryList;
	},
	
	/**
	 * 删除聊天记录
	 * @param {Object} myId
	 * @param {Object} friendId
	 */
	deleteUserChatHistory : function(myId, friendId){
		var chatKey = "chat-" + myId + "-" + friendId;
		plus.storage.removeItem(chatKey);
	},
	
	/**
	 * 保存聊天记录快照,仅仅保存每次和朋友聊天的最后一条消息
	 * @param {Object} myId
	 * @param {Object} friendId
	 * @param {Object} msg
	 * @param {Object} isRead
	 */
	saveUserChatSnapshot : function(myId, friendId, msg, isRead){
		var me = this;
		var chatKey = "chatsnapshot-" + myId;
		
		//从本地缓存获取聊天快照list是否存在
		var chatSnapshotListStr = plus.storage.getItem(chatKey);
		var chatSnapshotList;
		
		if(me.isNotNull(chatSnapshotListStr)){
			chatSnapshotList = JSON.parse(chatSnapshotListStr);
			
			//循环快照list,并且判断每个元素是否包含匹配的friendId,如果匹配删除
			for(var i = 0; i < chatSnapshotList.length; i++){
				var charSnapshot = chatSnapshotList[i];
				if(charSnapshot.friendId == friendId){
					//删除已经存在的friendId对应的快照元素
					chatSnapshotList.splice(i, 1);
					break;
				}
			}
		}else{
			chatSnapshotList = [];
		}
		
		//构建聊天快照记录对象
		var singleMsg = new me.ChatSnapshot(myId, friendId, msg, isRead);
		
		//向list中追加msg对象并保存到缓存
		chatSnapshotList.unshift(singleMsg);
		plus.storage.setItem(chatKey, JSON.stringify(chatSnapshotList));
		
	},
	
	/**
	 * 获取用户快照记录列表
	 * @param {Object} myId
	 */
	getUserChatSnapshot : function(myId){
		var me = this;
		var chatKey = "chatsnapshot-" + myId;
		
		//从本地缓存获取聊天记录是否存在
		var chatSnapshotListStr = plus.storage.getItem(chatKey);
		var chatSnapshotList;
		
		if(me.isNotNull(chatSnapshotListStr)){
			chatSnapshotList = JSON.parse(chatSnapshotListStr);
		}else{
			chatSnapshotList = [];
		}
		
		return chatSnapshotList;
	},
	
	/**
	 * 删除本地聊天快照记录
	 * @param {Object} myId
	 * @param {Object} friendId
	 */
	deleteUserChatSnapshot : function(myId, friendId){
		var me = this;
		var chatKey = "chatsnapshot-" + myId;
		
		//从本地缓存获取聊天快照list是否存在
		var chatSnapshotListStr = plus.storage.getItem(chatKey);
		var chatSnapshotList;
		
		if(me.isNotNull(chatSnapshotListStr)){
			chatSnapshotList = JSON.parse(chatSnapshotListStr);
			
			//循环快照list,并且判断每个元素是否包含匹配的friendId,如果匹配删除
			for(var i = 0; i < chatSnapshotList.length; i++){
				var charSnapshot = chatSnapshotList[i];
				if(charSnapshot.friendId == friendId){
					//删除已经存在的friendId对应的快照元素
					chatSnapshotList.splice(i, 1);
					break;
				}
			}
		}else{
			return;
		}
		
		plus.storage.setItem(chatKey, JSON.stringify(chatSnapshotList));
	},
	
	/**
	 * 根据用户ID从本地联系人列表中获取信息
	 * @param {Object} friendId
	 */
	getFriendFromContactList : function(friendId){
		var contactListStr = plus.storage.getItem("contactList");
		if(this.isNotNull(contactListStr)){
			var contactList = JSON.parse(contactListStr);
			for(var i = 0; i < contactList.length; i++){
				var friend = contactList[i];
				if(friend.friendUserId == friendId){
					return friend;
				}
			}
		}else{
			return null;
		}
	},
	
	/**
	 * 标记未读消息为已读状态
	 * @param {Object} myId
	 * @param {Object} friendId
	 */
	readUserChatSnapshot : function(myId, friendId){
		var me = this;
		var chatKey = "chatsnapshot-" + myId;
		
		//从本地缓存获取聊天记录是否存在
		var chatSnapshotListStr = plus.storage.getItem(chatKey);
		var chatSnapshotList;
		
		if(me.isNotNull(chatSnapshotListStr)){
			chatSnapshotList = JSON.parse(chatSnapshotListStr);
			//循环list,判断是否存在好友,比对friendId,如果有删除它,并放入一个标记已读的快照对象
			for(var i = 0; i < chatSnapshotList.length; i++){
				var item = chatSnapshotList[i];
				if(item.friendId == friendId){
					item.isRead = true;
					//替换原有的快照
					chatSnapshotList.splice(i, 1, item);
					
					break;
				}
			}
			plus.storage.setItem(chatKey, JSON.stringify(chatSnapshotList));
		}else{
			return;
		}
		
	}
}
