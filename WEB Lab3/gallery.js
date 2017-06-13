var dlt = false;
(function() {
//********************
var uploadLayer, slideShowLayer, darkLayer,
    imagesDiv,
    goUploadBtn;
function init() {
    $("#uploadBtn").click(uploadImage);
    $("#slideShowBtn").click(slideShow);

    imagesDiv = $("#images");
    goUploadBtn = $("#goUploadBtn");

    uploadLayer = $("#upload");
    slideShowLayer = $("#slideShow");
    darkLayer = $("#dark");
    darkLayer.click(function(){clearInterval(slideTimer);hideDark();});
    $("body").keydown(function(e){
        if (e.which == 27/*ESC*/) {
            clearInterval(slideTimer);
            hideDark();
        } });

    loadImages();
    //var i = 0;
    //var _this = this;
    $.ajax_upload($("#goUpload"), {
        submitBtn: goUploadBtn,
        action: "upload.php",
        name: "userfile",
        /*additional: $("#additional").children().clone(),*/
        additional : function(){
            var data = {};
            $("#additional > input").each(function(i, el){
                /*alert($(el).attr("name")+"="+$(el).val());*/
                data[$(el).attr("name")]=$(el).val();
            })
            return data;
        },
        /*data: ()(),*/
        onSubmit : function(file, ext) {
            $("#loadingImg").css("visibility", "visible");
            goUploadBtn.prop("disabled", true);
            this.disable();
        },
        onComplete: function(file, response) {
            $("#loadingImg").css("visibility", "hidden");
            goUploadBtn.prop("disabled", false);
            this.enable();
        },
        onError: function(file, response){
            alert("Error"+response);
            goUploadBtn.prop("disabled", false);
            //this.enable();
        },
        onSuccess: function(file){
            loadImages();
        }
    });
}
function uploadImage() {
    showDark();
    uploadLayer.css("visibility", "visible");
}

function slideShow() {
    //showDark();
    //slideShowLayer.css("visibility", "visible");
    var imgQueue = $(".img").toArray();
    slideTimer = setInterval(function(){
        if (imgQueue.length != 0) {
        var img = imgQueue.pop();
        $(img).mouseup();
        } else {
            clearInterval(slideTimer);
        }
    }, 2500);
}

function showDark() {
    darkLayer.css("visibility", "visible");
}

function hideDark() {
    darkLayer.css("visibility", "hidden");
    /*uploadLayer.css("visibility", "hidden");
    slideShowLayer.css("visibility", "hidden");*/
    //$(".popup").each(function(){$(this).css("visibility", "hidden")});
    $(".popup").css("visibility", "hidden");
    if ($("#loadingImg").css("visibility") != "hidden") {
        $("#loadingImg").css("visibility", "inherit");
    }
}

function bigView(img) {
    if (dlt) {
        dlt = false;
        return;
    }
    showDark();
    //$("#bigView").css("background","#FFFFFF url("+img+") no-repeat center center");
    $("#bigImg").attr("src"," "+img);
    $("#bigImg").load(function(){
        $("#bigView").css({"visibility":"visible",
            "top": ($("body")[0].clientHeight - parseInt($("#bigView").height()))/2+"px",
            "left": ($("body")[0].clientWidth - parseInt($("#bigView").width()))/2+"px"});
        //$("#bigView").css("background-size", "contain");
    });
}

function loadImages() {
    $.get("images.xml", function(xml){
        var $xml = $(xml),
            images = $xml.find("image"),
            imgTemplate = $("#imgTemplate");
        imagesDiv.empty();
        for (var im = images.first(); im.is("image"); im = im.next()) {
            var newEl = imgTemplate.clone().attr("id", ""+im.attr("id"));//.css("display", "inherit");
            newEl.find(".img").css("background","url(thumb.php?src=images/"+im.find("file").text()+"&w=150&h=150&zc=1) no-repeat")
                .mouseup("images/"+im.find("file").text(), function(e){bigView(e.data); });

            newEl.find(".title").text(im.find("title").text());
            /*$('<div id="'+im.attr("id")+'">'+'<img src="images/'+im.find("file").text()+'"/></div>');*/
            /*newEl.append($('<div id="title">'+im.find("title").text()+'</div>'));*/
            imagesDiv.append(newEl);
        }
        $("#images >.imgcontainer > .img > .delimg").each(function(i, el){
            $(this).mousedown(function(){
                dlt = true;
                var el = $(this);
                $.get("del.php?id="+el.parent().parent().attr("id"), function(res){
                    /*alert(res);*/
                    if (res.split(" ")[0] == "success") {
                        $("#"+res.split(" ")[1]).remove();
                    }
                });
            });
        });
    });
}
$(document).ready(init);
//********************
})();
var slideTimer;