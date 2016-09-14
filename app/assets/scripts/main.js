$(document).ready(function(){
    $(".data").on('click', function(){
    	console.log("hello i'm clicked");
    	$(".nav-list_item").removeClass("active");
        $(".data").addClass("active");
    });
});