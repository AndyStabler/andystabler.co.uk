var wordFun={GRAVITY:.5};wordFun.animator=function(){"use strict";this.ctx=document.getElementById("word-fun-canvas").getContext("2d"),this.initDimension(),this.exploders=[],this.clearCanvas(),this.started=!1,this.paused=!1},wordFun.animator.prototype.initDimension=function(){"use strict";this.ctx.canvas.width=window.innerWidth,this.ctx.canvas.height=window.innerHeight,this.width=this.ctx.canvas.width,this.height=this.ctx.canvas.height},wordFun.animator.prototype.pushExploder=function(t){"use strict";if(!this.paused){var i=this;this.exploders.push(t);var e=setInterval(function(){t.isFinished()&&(i.shiftExploder(),clearInterval(e))},500);this.started||(this.started=!0,this.animRequest=requestAnimationFrame(anim.explode.bind(anim)))}},wordFun.animator.prototype.shiftExploder=function(){"use strict";this.exploders.shift(),0==this.exploders.length&&(cancelAnimationFrame(this.animRequest),this.started=!1,this.clearCanvas())},wordFun.animator.prototype.clearCanvas=function(){"use strict";this.ctx.clearRect(0,0,this.width,this.height)},wordFun.animator.prototype.explode=function(){"use strict";this.initDimension(),this.exploders.forEach(function(t){t.explode()}),this.animRequest=requestAnimationFrame(this.explode.bind(this))},wordFun.animator.prototype.fire=function(){"use strict";var t=this.ctx.canvas.width,i=this.ctx.canvas.height,e=wordFun.ran(t>200?100:0,t>200?t-100:t),n=wordFun.ran(i>200?100:0,i>200?i-100:i);this.pushExploder(new wordFun.exploder(this.ctx,e,n))},wordFun.animator.prototype.pauseToggle=function(){"use strict";this.paused?(this.paused=!1,requestAnimationFrame(anim.explode.bind(anim))):(this.paused=!0,this.animRequest=cancelAnimationFrame(this.animRequest))},wordFun.exploder=function(t,i,e){"use strict";this.ctx=t,this.makePellets(i,e,20)},wordFun.exploder.prototype.makePellets=function(t,i,e){"use strict";for(var n=[],s=0;e>s;s++)n.push(new wordFun.pellet(t,i));this.pellets=n},wordFun.exploder.prototype.explode=function(){"use strict";this.draw(),this.pellets.forEach(function(t){t.updatePosition()})},wordFun.exploder.prototype.draw=function(){"use strict";var t=this;this.pellets.forEach(function(i){i.draw(t.ctx)})},wordFun.exploder.prototype.isFinished=function(){"use strict";return this.pellets.some(function(t){return t.dead})},wordFun.pellet=function(t,i){"use strict";this.size=100,this.x=t,this.y=i,this.opacity=1,this.dead=!1,this.speed=wordFun.ran(5,10),this.setAngle(wordFun.ran(0,360)*(Math.PI/180)),this.colour=wordFun.randomColor()},wordFun.pellet.prototype.setAngle=function(t){"use strict";this.angle=t,this.scaleX=Math.cos(this.angle),this.scaleY=Math.sin(this.angle),this.vx=this.speed*this.scaleX,this.vy=this.speed*this.scaleY},wordFun.pellet.prototype.updatePosition=function(){"use strict";this.x+=this.vx,this.y-=this.vy,this.vy-=wordFun.GRAVITY,this.opacity-=this.opacity>.02?.02:0,this.opacity<=.2&&(this.dead=!0)},wordFun.pellet.prototype.draw=function(t){"use strict";t.save(),t.globalAlpha=this.opacity,t.fillStyle=this.colour,t.beginPath();var i=t.canvas.width/this.size;t.rect(this.x,this.y,i,i),t.fill(),t.restore()},wordFun.randomColor=function(){"use strict";for(var t="0123456789ABCDEF".split(""),i="#",e=0;6>e;e++)i+=t[Math.floor(16*Math.random())];return i},wordFun.ran=function(t,i){"use strict";return Math.floor(Math.random()*(i-t))+t},function(){for(var t=0,i=["ms","moz","webkit","o"],e=0;e<i.length&&!window.requestAnimationFrame;++e)window.requestAnimationFrame=window[i[e]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[i[e]+"CancelAnimationFrame"]||window[i[e]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(i,e){var n=(new Date).getTime(),s=Math.max(0,16-(n-t)),o=window.setTimeout(function(){i(n+s)},s);return t=n+s,o}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(t){clearTimeout(t)})}();