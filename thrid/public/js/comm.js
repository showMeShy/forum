$(function() {

    var isLogin = localStorage.getItem("login");
    if (isLogin == 1) {
        // console.log(123)
        $("#two").css("display", "");
        $("#one").css("display", "none");
    } else {
        $("#two").css("display", "none");
        $("#one").css("display", "");
    }


    $("#exit").click(function() {

            localStorage.clear();
        })


        $("#post").click(function(){
            if(isLogin){
                $(location).attr("href","http://127.0.0.1:3000/topic/posted")
            }else{
                alert("请先登录")
            }
            return false
        })
})