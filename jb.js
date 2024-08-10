function JBJS(){

  var thisJS = this;
  thisJS.scrollPosition = -1;
  thisJS.scrollDirectionUp = null;

  this.addListener = function (e,d,n){return e.addEventListener ? e.addEventListener(n,d) : e.attachEvent(n,d)}
  this.whenLoaded = function(e){thisJS.addListener(window,e,"load") || thisJS.addListener(window,e,"onload")}
  this.whenReady = function(e){thisJS.addListener(document,e,"DOMContentLoaded") || thisJS.whenLoaded(e)}
  this.defer = function(method){if(window.jQuery){method()} else{setTimeout(function(){thisJS.defer(method)},50)}}


  this.defer(function(){

    $(window).on("scroll", function(){
      if(thisJS.scrollPosition > $(window).scrollTop()){
        thisJS.scrollDirectionUp = true;
      } else{
        thisJS.scrollDirectionUp = false;
      }
      thisJS.scrollPosition = $(window).scrollTop();
    });
  });

  this.BalfBar = function(selector, options){
    if(jQuery().BalfBar){
      return $(selector).BalfBar(options);
    }
  };

  this.BalfPick = function(selector, options){
    if(jQuery().BalfPick){
      return $(selector).BalfPick(options);
    }
  };

  this.simpleSlideShow = function(selector, duration){
    var i = 0;
    var len = $(selector).length;
    setTimeout(function(){
      $(selector).eq(len - 1 - i).animate({"opacity" : 0});
      i++;
    }, 50);
    setInterval(function(){
      var next = i + 1;
      if(next >= len){
        next = 0;
      }

      //Perform at the same time
      $(selector).eq(len - 1 - i).animate({"opacity" : 0}, 2000);
      $(selector).eq(len - 1 - next).animate({"opacity" : 1}, 2000);

      i = next;
    }, duration);
  };

  this.elementInView = function(id, negative) {
    var $elem = $(id);
    var $window = $(window);

    //The element position
    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();

    //The viewport
    var scrollTop = thisJS.scrollPositionition().top;
    var scrollBottom = thisJS.scrollPositionition().bottom;



    if(thisJS.scrollDirectionUp === false){
      //Going down
      return scrollBottom >= elemTop && scrollTop <= elemTop;
    } else if (thisJS.scrollDirectionUp === true){
      //Going up
      return scrollTop <= elemBottom - ($elem.height() / 2) && scrollTop >= elemTop;
    } else if(thisJS.scrollPosition == -1){
      return (scrollBottom >= elemTop && scrollTop <= elemTop) || (scrollTop <= elemBottom - ($elem.height() / 2) && scrollTop >= elemTop);
      //return ((elemBottom <= scrollBottom) && (elemTop >= scrollTop));
    }

    return false;
  };

  this.objectInScrollViewport = function(id){

    var elemTop = $(id).offset().top;
    var elemBottom = elemTop + $(id).height();
    var top = thisJS.scrollPositionition().top;
    var bottom = thisJS.scrollPositionition().bottom;

    if(bottom > elemTop){
      var dif = (bottom - elemTop) / $(id).height();
      return dif;
    }

    return -1;

  };

  this.scrollPositionition = function(){
    return {"top" : $(window).scrollTop(), "bottom" : $(window).scrollTop() + $(window).height()};
  }

  this.initiateWhenInViewport = function (id, in_view, out_view, once) {

    var f = function() {
      var $elem = $(id);
      $($elem).each(function(){
        if (thisJS.elementInView($(this))) {
          if ($(this).attr("data-in-view") != "true") {
            $(this).attr("data-in-view", "true");
            in_view(this);
            if(once == true){
              $(window).off("scroll", f);
            }
          }

        } else {
          if("data-in-view" != "false"){
            $(this).attr("data-in-view", "false");
            if(out_view != undefined && out_view != null){
              out_view(this);
            };
          }

        }
      });

    };

    $(window).scroll(f);
    $(window).resize(f);
    setTimeout(function(){f()}, 500);
  };

  this.bindAction = function(object, offset, action){
    var f = function(){
      $(object).each(function(){
        var scrollBottom = thisJS.scrollPositionition().bottom;
        var elemTop = $(this).offset().top;
        var elemBottom = elemTop + $(this).height();

        if (scrollBottom > elemTop) {
          action(this, thisJS.objectInScrollViewport(this));
        }
      });
    };


    $(window).on("scroll", f);
    $(window).resize(f);
    setTimeout(function(){f()}, 500);
  };

  this.setCookie = function (name, value) {
    var today = new Date();
    var expire = new Date();
    expire.setTime(today.getTime() + 3600000 * 24 * 999);
    document.cookie = name + "=" + escape(value) + ";expires=" + expire.toGMTString() + ";path=/";
  };

  this.setSessionCookie = function (name, value) {
    var today = new Date();
    var expire = new Date();
    expire.setTime(today.getTime() + 3600000 * 24 * 999);
    document.cookie = name + "=" + escape(value) + "";
  };

  this.getCookie = function (cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
  };

  return this;
};

var JBJS = JBJS();
