$(function() {

    var isLogin = localStorage.getItem("login");
    if (isLogin == 1) {
        console.log(123)
        $("#two").css("display", "");
        $("#one").css("display", "none");
    } else {
        $("#two").css("display", "none");
        $("#one").css("display", "");
    }

<<<<<<< HEAD
        $("#exit").click(function(){
=======
    $("#exit").click(function() {
>>>>>>> f771a72eb50f911363c503c26ce01fa24f30bbcd
            localStorage.clear();
        })
        // $("#post").click(function(){
        //     console.log(456)
        //     if(isLogin){
        //         window.location.herf="http://127.0.0.1:3000/topic/posted";
        //     }else{
        //         window.location.herf="http://127.0.0.1:3000/login.html";
        //     }
        // })
})