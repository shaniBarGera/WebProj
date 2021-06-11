function Lagrange(canvas1id, canvas2id, scale, pt, ptX, ptY){

var canvas, canvas2, ctx, ctx2, w,h,h1, d,d2,  dragId = -1, dragId2 = -1, bF;
var n = pt.length, n1 = n+1;
var iColor = ["#f00000","#00f000","#0000f0","#00f0f0","#f0f000","#f000f0","#090909"];
var Px = new Float64Array(ptX),
    Py = new Float64Array(ptY),
    ti = new Float64Array(pt);
   canvas = document.getElementById(canvas1id);
   ctx = canvas.getContext("2d");
   canvas.addEventListener('mousemove', drag, false);
   canvas.addEventListener('touchmove', drag, false);
   canvas.addEventListener('mousedown', start_drag, false);
   canvas.addEventListener('mouseup', stop_drag, false);
   canvas.addEventListener('touchstart', start_drag, false);
   canvas.addEventListener('touchend', stop_drag, false);
   canvas2 = document.getElementById(canvas2id);
   ctx2 = canvas2.getContext("2d");
   canvas2.addEventListener('mousemove', drag2, false);
   canvas2.addEventListener('touchmove', drag2, false);
   canvas2.addEventListener('mousedown', start_drag2, false);
   canvas2.addEventListener('mouseup', stop_drag2, false);
   canvas2.addEventListener('touchstart', start_drag2, false);
   canvas2.addEventListener('touchend', stop_drag2, false);
   window.addEventListener('resize', resize, false);
   resize();

function drawFun(){
  ctx2.clearRect(0,0, w, h);
  ctx2.lineWidth = d;
  var step = 1/(w-1), t = m = min = max = 0;
  for (var k = 0; k < w; k++){
   for (var j = 0; j < n; j++){
    var P = 1;
    for (var i = 0; i < n; i++)
      if (i != j) P = P*(t-ti[i])/(ti[j] - ti[i]);
    if (P > max) max = P;
    if (P < min) min = P;
    bF[m++] = P;}
   t += step;}
  var M = h1/(max - min);
  for (var i = 0; i < n; i++){
   ctx2.strokeStyle = iColor[i % 7];
   m = i;
   ctx2.beginPath();  ctx2.moveTo(0, h1 - M*(bF[i] - min));
   for (var k = 1; k < w; k++){
     m += n;
     ctx2.lineTo(k, h1 - M*(bF[m] - min));}
   ctx2.stroke();
  }
  t = h1 + M*min;
  ctx2.strokeStyle = "black";
  ctx2.beginPath();
  ctx2.moveTo(0, t);  ctx2.lineTo(w, t);
  ctx2.stroke();
  for (var i = 0; i < n; i++)
    ctx2.strokeRect(w*ti[i] - d, t - d, d2, d2);
}
function drawSpline(){
  var step = 1/(w - 1), t = step;
  var scPx = new Float64Array(n), scPy = new Float64Array(n);
  var X,Y;
  ctx.clearRect(0,0, w, h);
  ctx.lineWidth = d;
  ctx.strokeStyle = "#0000f0";
  for (var i = 0; i < n; i++){
   X = scPx[i] = Px[i]*w;
   Y = scPy[i] = Py[i]*h;
   ctx.strokeRect(X - d, h1 - Y - d, d2, d2);
  }
  if ( n > 2 ){
   ctx.beginPath();  ctx.moveTo(scPx[0], h1 - scPy[0]);
   for (var i = 1; i < n; i++)
    ctx.lineTo(scPx[i], h1 - scPy[i]);
   ctx.stroke();
  }
  ctx.lineWidth = d2;
  ctx.strokeStyle = "#f00000";
  var sX = sY = 0;
  for (var j = 0; j < n; j++){
   sX += scPx[j]*bF[j];  sY += scPy[j]*bF[j];}
  ctx.beginPath();  ctx.moveTo(sX, h1 - sY);
  m = n;
  for (var k = 1; k < w; k++){
   sX = sY = 0;
   for (var j = 0; j < n; j++){
     sX += scPx[j]*bF[m];  sY += scPy[j]*bF[m];  m++;}
   ctx.lineTo(sX, h1 - sY);}
  ctx.stroke();
}
function resize(){
   h = w = Math.round(window.innerWidth * scale);
   h1 = h-1;
   d = Math.max(1, Math.round(w / 250));  d2 = d+d;
   canvas.width = w;  canvas.height = h;
   canvas2.width = w; canvas2.height = h;
   bF = new Float64Array(n*w);
   drawFun();
   drawSpline();
}
function drag(ev){
  if (dragId < 0) return;
  var c = getXY(ev, canvas);
  Px[dragId] = c[0];  Py[dragId] = c[1];
  drawSpline();
  ev.preventDefault();
}
function start_drag(ev){
  var c = getXY(ev, canvas);
  var Rmin = 2, r2,xi,yi;
  for (var i = 0; i < n; i++){
   xi = (c[0] - Px[i]); yi = (c[1] - Py[i]);
   r2 = xi*xi + yi*yi;
   if ( r2 < Rmin ){ dragId = i; Rmin = r2;}}
  Px[dragId] = c[0];  Py[dragId] = c[1];
  drawSpline();
  ev.preventDefault();
}
function stop_drag(ev){
  dragId = -1;
  ev.preventDefault();
}
function drag2(ev){
  if (dragId2 < 0) return;
  var c = getXY(ev, canvas2);
  ti[dragId2] = c[0];
  drawFun();
  drawSpline();
  ev.preventDefault();
}
function start_drag2(ev){
  var c = getXY(ev, canvas2);
  var Rmin = 2, r2,xi;
  for (var i = 1; i < n-1; i++){
   xi = (c[0] - ti[i]);  r2 = xi*xi;
   if ( r2 < Rmin ){ dragId2 = i; Rmin = r2;}}
  ti[dragId2] = c[0];
  drawFun();
  drawSpline();
  ev.preventDefault();
}
function stop_drag2(ev){
  dragId2 = -1;
  ev.preventDefault();
}
function getXY(ev, cnv){
  if (!ev.clientX) ev = ev.touches[0];
  var rect = cnv.getBoundingClientRect();
  var x = (ev.clientX - rect.left) / w,
      y = (h1 - (ev.clientY - rect.top)) / h;
  return [x, y];
}
} 