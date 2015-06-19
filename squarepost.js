(function( $ ) {
 
    $.fn.squarePost = function(options) {
 		var settings = $.extend({
            // These are the defaults.
            column:5,
            fadeOut:500,
            fadeOutAlpha:0.1,
            fadeIn:1000,
            interval:2000,
            link:true,
            caption:true,
            background:"rgba(0,0,0,0.2)"
        }, options );

 		if(settings.src===undefined){
 			console.log('ERROR (SquarePost) : No source specified');
 			return this;
 		}

        if(settings.row==undefined){
            settings.row=settings.column;
        }
		var postArray=new Array();
        this.filter( "div" ).each(function() {
            var div = $( this );
            div.css({
            	'background-color': settings.background,
            	'padding':'0',
            	'overflow':'hidden'
            });
            $.getJSON( settings.src,function( data ){
                for(i=0;i<data.length;i++)
                postArray.push(data[i]);
                start();
            });

            function start(){

            var printedPosts=new Array();
            var toSelect=new Array();
            for(i=0;i<settings.column*settings.row;i++){
                div.append(function(){
                    var d=$('<div class="squarediv"></div>');
                    d.css('width',100/settings.column+'%');
                    return d;
                });
            }

            $(".squarediv").css('height',$(".squarediv").first().width());
            $(window).resize(function(){
                    $(".squarediv").css('height',$(".squarediv").first().width());
            })
            for(i=0;i<settings.column*settings.row;i++){
                    random=Math.floor(Math.random() * postArray.length);
                    var a=$((settings.link?'<a class="squarelink" href="'+postArray[random].url+'">':"")+'<div class="squarebackground" style="background-image:url('+postArray[random].thumbnail+');"><span class="squarecaption">'+(settings.caption?postArray[random].caption:"")+'</span></div></a>');
                    $('.squarediv').eq(i).append(a);
                    printedPosts[i]=postArray[random];
                    postArray.splice(random,1);
            }

            setInterval(function(){
                    if(toSelect.length==0){
                        for(i=0;i<settings.column*settings.row;i++){
                          toSelect[i]=i;
                        }
                    }
                    postTochange=Math.floor(Math.random() * toSelect.length);
                    post=toSelect[postTochange];
                    toSelect.splice(postTochange,1);
                    random=Math.floor(Math.random() * postArray.length);
                    postArray.push(printedPosts[post]);
                    printedPosts[post]=postArray[random];
                    postArray.splice(random,1);
                    div.children('.squarediv').eq(post).fadeTo(settings.fadeOut,settings.fadeOutAlpha,function(){ 
                        if(settings.link){
                            $(this).children('a').replaceWith(function(){
                            var a=$((settings.link?'<a class="squarelink" href="'+printedPosts[post].url+'">':"")+'<div class="squarebackground" style="background-image:url('+printedPosts[post].thumbnail+');"><span class="squarecaption">'+(settings.caption?printedPosts[post].caption:"")+'</span></div></a>');
                            return a;
                        });
                        }
                        else{
                            $(this).children('div').first().replaceWith(function(){
                            var a=$((settings.link?'<a class="squarelink" href="'+printedPosts[post].url+'">':"")+'<div class="squarebackground" style="background-image:url('+printedPosts[post].thumbnail+');"><span class="squarecaption">'+(settings.caption?printedPosts[post].caption:"")+'</span></div></a>');
                            return a;
                            });
                        }
                        $(this).fadeTo(settings.fadeIn,1);
                    });
            },settings.interval);

            }
            
        });
 
        return this;
 
    };
 
}( jQuery ));