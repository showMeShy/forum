$(function () {
  //判断是否在前面加0
  function getNow(s) {
    return s < 10 ? "0" + s : s;
  }

  //第一次回复
  $("#subBtn").click(function () {
    var topicId = $("#topicId").html();
    if ($("#replyInp").val() != "") {
      var replyContent=$("#replyInp").val();

      var myDate = new Date();
      var year = myDate.getFullYear(); //获取当前年
      var month = myDate.getMonth() + 1; //获取当前月
      var date = myDate.getDate(); //获取当前日

      var h = myDate.getHours(); //获取当前小时数(0-23)
      var m = myDate.getMinutes(); //获取当前分钟数(0-59)
      var s = myDate.getSeconds();

      var now = year + "-" + getNow(month) + "-" + getNow(date) + " " + getNow(h) + ":" + getNow(m) + ":" + getNow(s);

      $.ajax({
        url: "/questionDetails/" + topicId + "/addReply",
        method: "post",
        data: {
          userName: "测试",
          replyContent: replyContent,
          replyTime: now,
          replyId:123,
          secondReplay:[]
        },
        success: function () {
          $("#replyInp").val("");
        },
      });
    }
  });


  //第二次回复
  $(".SecReplyBtn").click(function () {
    var num = $(this).index(".SecReplyBtn");
    $($(".SecReplyBox")[num]).css("display", "");
  });

  $(".cancelBtn").click(function () {
    var num = $(this).index(".cancelBtn");
    $($(".SecReplyBox")[num]).css("display", "none");
  });

  // $(".SecSubBtn").click(function () {
  //   var topicId = $("#topicId").html();

  //   var num = $(this).index(".SecSubBtn");
  //   var SecReplyVal = $($(".SecReplyInp")[num]).val();
  //   var myDate = new Date();

  //   var year = myDate.getFullYear(); //获取当前年
  //   var month = myDate.getMonth() + 1; //获取当前月
  //   var date = myDate.getDate(); //获取当前日

  //   var h = myDate.getHours(); //获取当前小时数(0-23)
  //   var m = myDate.getMinutes(); //获取当前分钟数(0-59)
  //   var s = myDate.getSeconds();

  //   var now = year + "-" + getNow(month) + "-" + getNow(date) + " " + getNow(h) + ":" + getNow(m) + ":" + getNow(s);
  //   $.ajax({
  //     url: "/topic/details/" + topicId + "/addSecReply",
  //     method: "post",
  //     data: {
  //       userName: "测试",
  //       replyContent: SecReplyVal,
  //       replyTime: now,
  //     },
  //     success: function (data) {},
  //   });
  // });
});
