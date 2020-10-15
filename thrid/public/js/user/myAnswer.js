//查询未读消息
function queryUnreadMessage() {
    get_request(function(value) {
            if (value != "") {
                var unreadMessage = JSON.parse(value);
                var privateMessageCount = parseInt(unreadMessage.privateMessageCount);
                var systemNotifyCount = parseInt(unreadMessage.systemNotifyCount);
                var remindCount = parseInt(unreadMessage.remindCount);
                if (privateMessageCount > 0) {
                    //显示红点
                    var privateMessage_badge = document.getElementById("privateMessage-badge"); //用户中心页
                    if (privateMessage_badge != null) {
                        privateMessage_badge.style.display = ""; //显示
                    }
                } else {
                    //隐藏红点
                    var privateMessage_badge = document.getElementById("privateMessage-badge"); //用户中心页
                    if (privateMessage_badge != null) {
                        privateMessage_badge.style.display = "none"; //隐藏
                    }
                }
                if (systemNotifyCount > 0) {
                    //显示红点
                    var systemNotify_badge = document.getElementById("systemNotify-badge"); //用户中心页
                    if (systemNotify_badge != null) {
                        systemNotify_badge.style.display = ""; //显示
                    }
                } else {
                    //隐藏红点
                    var systemNotify_badge = document.getElementById("systemNotify-badge"); //用户中心页
                    if (systemNotify_badge != null) {
                        systemNotify_badge.style.display = "none"; //隐藏
                    }
                }
                if (remindCount > 0) {
                    //显示红点
                    var remind_badge = document.getElementById("remind-badge"); //用户中心页
                    if (remind_badge != null) {
                        remind_badge.style.display = ""; //显示
                    }
                } else {
                    //隐藏红点
                    var remind_badge = document.getElementById("remind-badge"); //用户中心页
                    if (remind_badge != null) {
                        remind_badge.style.display = "none"; //隐藏
                    }
                }

                //所有消息
                if ((privateMessageCount + systemNotifyCount + remindCount) > 0) {
                    //显示红点
                    var allMessage_badge = document.getElementById("allMessage-badge");
                    if (allMessage_badge != null) {
                        allMessage_badge.style.display = ""; //显示
                    }
                } else {
                    //隐藏红点
                    var allMessage_badge = document.getElementById("allMessage-badge");
                    if (allMessage_badge != null) {
                        allMessage_badge.style.display = "none"; //隐藏
                    }
                }
            }
        },
        "user/control/unreadMessageCount?timestamp=" + new Date().getTime(), true);
}
queryUnreadMessage();