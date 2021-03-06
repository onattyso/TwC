// Browser detection for when you get desparate. A measure of last resort.
// http://rog.ie/post/9089341529/html5boilerplatejs
// sample CSS: html[data-useragent*='Chrome/13.0'] { ... }
//
// var b = document.documentElement;
// b.setAttribute('data-useragent',  navigator.userAgent);
// b.setAttribute('data-platform', navigator.platform);


// remap jQuery to $
(function($){
    site = {
        emails: $('.wrapper>div'),
        paddingTop:window.innerHeight,
        messages:'',
        dayCount: '',
        init: function(){
            console.log('test');
            site.spreadsheet();
            site.miscFunctions();   
        },
        probe: function(){
            var position;

            function loaded () {
                document.addEventListener("touchmove", ScrollStart, false);
                document.addEventListener("scroll", Scroll, false);

                function ScrollStart() {
                    updateTime();
                    scrollValue = $(window).scrollTop();
                }

                function Scroll() {
                    updateTime();
                    scrollValue = $(window).scrollTop();
                    if(scrollValue >= window.innerHeight/2){
                        $('#aboutImg').css('display','block');
                    }
                    else {
                        $('#aboutImg').css('display','hidden');
                    }
                }
            }
            function updateTime(){
            };
            loaded();
        },
        resize: function(){
        },
        paddingBottom: function(){
            $('.message').css('padding-bottom','0px');
            paddingBottom = ( site.paddingTop-$('.wrapper>div').last().height() )/2;
            if(paddingBottom <= 50){
                paddingBottom = 100
            }
            $('.wrapper>div').last().css('padding-bottom', '25px');
        },
        spreadsheet: function(){
            $.getJSON("js/messages.json", function(json) {
                // console.log(json); // this will show the info it in firebug console
                site.messages = json;
                site.buildFeed(json);
                site.probe();
                console.log('go');
            });
        },

        buildFeed: function(data){
            wrapper = document.getElementsByClassName('wrapper')[0];
            var messages = site.messages;

            // our variable holding starting index of this "page"
            var index = 0;

            displayNext();

            // $("#facebook").click(function() {
            //     if(navigator.userAgent.match('CriOS')){
            //         console.log('ios Chrome');
            //     }else {
            //         FB.ui({
            //           method: 'share',
            //           href: 'http://textingwithcancer.com/',
            //         }, function(response){});
            //         return false;
            //     }
            // });

            function displayNext() {
            if($('.message').length < site.messages.length){
                Waypoint.destroyAll()
                // get the list element
                var amount = 0;
                var list = $('.wrapper');

                // get index stored as a data on the list, if it doesn't exist then assign 0
                var index = list.data('index') % messages.length || 0;

                // 1) get 20 elements from array - starting from index, using Array.slice()
                // 2) map them to array of li strings
                // 3) join the array into a single string and set it as a HTML content of list

                $.each(messages.slice(index, index + messages.length), function(index, val) {
                    //index is the # object in the array
                        amount++;
                        parseMessage();
                        var my_array = document.getElementsByClassName("text");
                        var last = my_array[my_array.length - 1];
                        lastDate = messages[parseInt($(last).index())-1];
                        if(author != 'none'){
                            $('.wrapper').append('<div class="'+side+' text"><p>'+copy+'</p></div>');
                            $('.message').last().children('p').linkify();

                            if($(last).index()>0){
                                if(lastDate.DATE != val.DATE){
                                    site.dayCount++;
                                    newLast = $('div.text').last();
                                    newLast.prepend('<span><div class ="date">'+val.DATE+'</div></span>');
                                }
                            }
                        }
      //                   if($(last).index()>0){
         //                    if(lastDate.DATE != val.DATE){
                        //      site.dayCount++;
                        //      newLast = $('div.text').last();
                        //      newLast.prepend('<span><div id="date">'+val.DATE+'</div></span>');
                        //  }
                        //  if(lastDate.TIME !=val.TIME){
                        //      site.dayCount++;
                        //      $('.text').attr('data-after', val.TIME);
                        //  }
                        // }

                    function parseMessage(){
                        author();
                        copy();
                        time();
                    };
                    function author(){
                        // set author per item
                        if(val.AUTHOR.substring(0,2) == 'me'){
                            author = val.AUTHOR.substring(0,2);
                            side = 'me';
                        }else if(val.AUTHOR.substring(0,8) == 'positive'){
                            author = val.AUTHOR.substring(0,8);
                            side = 'optimism'
                        }else if(val.AUTHOR.substring(0,8) == 'negative'){
                            author = val.AUTHOR.substring(0,8);
                            side = 'pessimism'
                        }
                    };
                    function time() {
                        timeRaw = JSON.stringify(val.TIME).replace(/[\\]n/g, '<br/>').replace(/\\/g, "");
                        time = timeRaw.substring(1, timeRaw.length-1);
                    };
                    function copy(){
                        copyRaw = JSON.stringify(val.COPY).replace(/[\\]n/g, '<br/>').replace(/\\/g, "");
                        copy = copyRaw.substring(1, copyRaw.length-1);
                    };
                });
                list.data('index', parseInt(index) + parseInt(amount));
                if(amount > 0 ){
                    site.postBuild();
                }
            }
        }
        },
        postBuild: function(){
            ps = $('.message').children('p');
            psArray = [];
            for (i = 0; i < ps.length; i++) { 
                psArray.push(ps[i]);
            }
            site.paddingBottom();
            $.each(['message'], function(i, classname) {
              var $elements = $('.' + classname);
              $elements.each(function() {
                new Waypoint({
                  element: this,
                  handler: function(direction) {
                    var previousWaypoint = this.previous()
                    var nextWaypoint = this.next()

                    $elements.removeClass('np-previous np-current np-next')
                    $(this.element).addClass('np-current')
                        item = $(this.element);
                        p = item.children('p').last()[0];
                        itemIndex = jQuery.inArray(p, psArray);
                        itemTime = moment(""+site.messages[itemIndex].DATE+" "+site.messages[itemIndex].TIME+"");

                        // var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
                        // var selectedMonthName = months[itemTime.month()];

                        // $('#date').html(selectedMonthName +" "+ itemTime.date() +", "+ itemTime.year() +"");
                        // if(itemTime.hour() >= 12){
                        //  period = 'pm';
                        // }else {
                        //  period = 'am';
                        // }

                        // $('#time').html(((itemTime.hour() + 11) % 12 + 1) +":"+('0' + itemTime.minutes()).slice(-2) +" "+period+"");
                    if (previousWaypoint) {
                      $(previousWaypoint.element).addClass('np-previous')
                    }
                    if (nextWaypoint) {
                      $(nextWaypoint.element).addClass('np-next')
                    }
                  },
                  offset: '75%',
                  group: classname
                })
              })
            });
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $('html,body').css('overflow-y','auto');
            // $('#header').css('height','75%');
            $('footer').css('height','auto');
            $('.loading').animate({opacity: 0});
        },
        miscFunctions: function(){
            $("#footer").click(function() {
                $('html, body').stop();
                $('html, body').css('overflow','hidden');
                var scrollTop = $(document).scrollTop();
                speed = (scrollTop-$(document).height())/2;
                if(speed < 3000 || speed > 3000){
                    speed = 3000;
                }
                $("html, body").animate({ scrollTop: $(document).height() }, speed, function(){
                    $('html, body').css('overflow','auto');
                });
              return false;
            });
            $("#details").click(function() {
                if($('#about').hasClass('open')){
                    about.closeAbout();
                }else{
                    about.showAbout();
                }
                return false;
            });
            $('.wrap').on('click',function(){
                if($('#about').hasClass('open')){
                    about.closeAbout();
                }
            });
        },
    };
    about = {
        showAbout: function(){
            $('#about').addClass('open');
            $('.all').addClass('hide');
        },
        closeAbout: function(){
            $('#about').removeClass('open');
            $('.all').removeClass('hide');
        }
    };

$(document).ready(function (){
    setTimeout(function(){
        window.scrollTo(0,0);
        site.init();
    },1000)
});

$( window ).resize(function() {
});

})(window.jQuery);


