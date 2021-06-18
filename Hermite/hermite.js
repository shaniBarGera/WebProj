            window.onload = function () {
                var r = Raphael("holder", 1200, 800),
                    discattr = {fill: "#fff", stroke: "none"};
                var //ipath = 0,
                    ip0 = 0,
                    ip0in = 4,
                    ip0out = 1,
                    ip1 = 3,
                    ip1in = 2,
                    ip1out = 5,                    
                    ip2 = 6,
                    ip2in = 7,
                    ip2out = 8;
                r.rect(0, 0, 1199, 799, 20).attr({stroke: "#666", "stroke-width": 10});
                r.text(600, 40, "Generic Cubic Hermite spline - Note how easy it is to generate sharp edges near the keys").attr({fill: "#fff", "font-size": 16});
                r.text(600, 60, "Also note that 'time' is evently distributed").attr({fill: "#fff", "font-size": 16});
                r.text(600, 100, "Drag the keys and tangents around").attr({fill: "#fff", "font-size": 16});
                function curve(p0x, p0y, p0inX, p0inY, p0outX, p0outY, p1x, p1y, p1inX, p1inY, p1outX, p1outY, p2x, p2y, p2inX, p2inY, p2outX, p2outY, color) {
                    var path = [["M", p0x, p0y]], // initial curve
                        curve = r.path(path).attr({stroke: color || Raphael.getColor(), "stroke-width": 4, "stroke-linecap": "round"}),
                            
                        fixArrow = function(arr, rad) {
                            var dx = arr[1][1] - arr[0][1];
                            var dy = arr[1][2] - arr[0][2];
                            var alpha = Math.atan2(dy,dx);
                            arr[1][1] -= 1.0 * rad * Math.cos(alpha);
                            arr[1][2] -= 1.0 * rad * Math.sin(alpha);
                            return arr;
                        },
                        
                        tanForce = 1.0,
                        
                        posRad = 20,
                        tanRad = 10,
                        posCol = "rgba(255, 0, 0, 0.3)",
                        intanCol = "#0f0",
                        outtanCol = "#00f",
                        //p0curvein   = r.path(fixArrow([["M", p0inX, p0inY], ["L", p0x, p0y]], posRad)).attr({stroke: "#ccc", "stroke-dasharray": ".", 'stroke-width': 2 ,'arrow-end': 'classic-wide-long'}),
                        p0curveout  = r.path(fixArrow([["M", p0x, p0y], ["L", p0outX, p0outY]], tanRad)).attr({stroke: "#ccc", "stroke-dasharray": ".", 'stroke-width': 2 ,'arrow-end': 'classic-wide-long'}),
                        p1curvein   = r.path(fixArrow([["M", p1inX, p1inY], ["L", p1x, p1y]], posRad)).attr({stroke: "#ccc", "stroke-dasharray": ".", 'stroke-width': 2 ,'arrow-end': 'classic-wide-long'}),
                        p1curveout  = r.path(fixArrow([["M", p1x, p1y], ["L", p1outX, p1outY]], tanRad)).attr({stroke: "#ccc", "stroke-dasharray": ".", 'stroke-width': 2 ,'arrow-end': 'classic-wide-long'}),
                        p2curvein   = r.path(fixArrow([["M", p2inX, p2inY], ["L", p2x, p2y]], posRad)).attr({stroke: "#ccc", "stroke-dasharray": ".", 'stroke-width': 2 ,'arrow-end': 'classic-wide-long'}),
                        //p2curveout  = r.path(fixArrow([["M", p2x, p2y], ["L", p2outX, p2outY]], tanRad)).attr({stroke: "#ccc", "stroke-dasharray": ".", 'stroke-width': 2 ,'arrow-end': 'classic-wide-long'}),

                        p0 = r.circle(p0x, p0y, posRad).attr({fill: posCol, stroke: "none"}),
                        p0out = r.circle(p0outX, p0outY, tanRad).attr({fill: outtanCol, stroke: "none"}),
                        p1in = r.circle(p1inX, p1inY, tanRad).attr({fill: intanCol, stroke: "none"}),
                        p1 = r.circle(p1x, p1y, posRad).attr({fill: posCol, stroke: "none"}),
                        //p0in = r.circle(p0inX, p0inY, tanRad).attr({fill: intanCol, stroke: "none"}),
                        p1out = r.circle(p1outX, p1outY, tanRad).attr({fill: outtanCol, stroke: "none"}),
                        p2 = r.circle(p2x, p2y, posRad).attr({fill: posCol, stroke: "none"}),
                        p2in = r.circle(p2inX, p2inY, tanRad).attr({fill: intanCol, stroke: "none"}),
                        //p2out = r.circle(p2outX, p2outY, tanRad).attr({fill: outtanCol, stroke: "none"}),
                        
                        p0t = r.text(0, 0, "P\u2080").attr({"font-size": "16x", fill: "yellow"}),
                        p1t = r.text(0, 0, "P\u2081").attr({"font-size": "16x", fill: "yellow"}),
                        p2t = r.text(0, 0, "P\u2082").attr({"font-size": "16x", fill: "yellow"}),
                        p2int = r.text(0, 0, "P\u2082 InTan").attr({"font-size": "16x", fill: "yellow"}),
                        p1int = r.text(0, 0, "P\u2081 InTan").attr({"font-size": "16x", fill: "yellow"}),
                        p1outt = r.text(0, 0, "P\u2081 TanOut").attr({"font-size": "16x", fill: "yellow"}),
                        p0outt = r.text(0, 0, "P\u2080 TanOut").attr({"font-size": "16x", fill: "yellow"}),

                        controls = r.set(
                            //r.path(path2).attr({stroke: "#ccc", "stroke-dasharray": ". "}), // the control lines
                            p0,
                            p0out,
                            p1in,
                            p1,
                            //p0in,
                            p1out,
                            p2,
                            p2in
                            //p2out
                        );
                    
                    // only for the middle key
                    recalculateTangents = function() {};
                    /*
                    
                        prev_in_x = p1in.attr("cx");
                        prev_in_y = p1in.attr("cy");
                        prev_out_x = p1out.attr("cx");
                        prev_out_y = p1out.attr("cy");
                    
                        var ratio = 0.5; // time is evenly distibuted. in the engine we use (cKey->fTime - pKey->fTime)/(nKey->fTime - pKey->fTime);
                        var oneMinusRatio = 1.0 - ratio;
                        var deltaX = p2.attr("cx") - p0.attr("cx");
                        var deltaY = p2.attr("cy") - p0.attr("cy");
                        var posx = p1.attr("cx");
                        var posy = p1.attr("cy");
                        
                        var new_in_x = posx - ratio * deltaX;
                        var new_in_y = posy - ratio * deltaY;
                        var new_out_x = posx + oneMinusRatio * deltaX;
                        var new_out_y = posy + oneMinusRatio * deltaY;
                        if (new_in_x != prev_in_x || new_in_y != prev_in_y || new_out_x != prev_out_x || new_out_y != prev_out_y) {
                            p1in.attr({cx : new_in_x, cy : new_in_y});
                            p1out.attr({cx : new_out_x, cy : new_out_y});
                        }
                    };
                    */
                    updatePath = function() {
                        
                        recalculateTangents();
                    
                        path = [["M", p0.attr("cx"), p0.attr("cy")]];
                        var di = 0.05;
                        var _p0x = p0.attr("cx");                            
                        var _p0y = p0.attr("cy");
                        var _p0r = p0.attr("r");
                        var _p0outx = p0out.attr("cx");
                        var _p0outy = p0out.attr("cy");
                        var _p0outr = p0out.attr("r");
                        var _v0outx = _p0outx - _p0x;
                        var _v0outy = _p0outy - _p0y;
                        var _p1x = p1.attr("cx");
                        var _p1y = p1.attr("cy");
                        var _p1r = p1.attr("r");
                        var _p1inx = p1in.attr("cx");
                        var _p1iny = p1in.attr("cy");
                        var _p1inr = p1in.attr("r");
                        var _p1outx = p1out.attr("cx");
                        var _p1outy = p1out.attr("cy");
                        var _p1outr = p1out.attr("r");
                        var _v1inx = _p1x - _p1inx;
                        var _v1iny = _p1y - _p1iny;
                        var _v1outx = _p1outx - _p1x;
                        var _v1outy = _p1outy - _p1y;
                        var _p2x = p2.attr("cx");
                        var _p2y = p2.attr("cy");
                        var _p2r = p2.attr("r");
                        var _p2inx = p2in.attr("cx");
                        var _p2iny = p2in.attr("cy");
                        var _p2inr = p2in.attr("r");
                        var _v2inx = _p2x - _p2inx;
                        var _v2iny = _p2y - _p2iny;

                        // p0 to p1
                        for (var t=0.0; t<1.0+di; t+=di) {
                            var t2 = t*t;
                            var t3 = t2*t;
                            var _2t3 = 2.0*t3;
                            var _3t2 = 3.0*t2;
                            var a = _2t3 - _3t2 + 1.0;
                            var b =-_2t3 + _3t2;
                            var c =   t3 - 2.0*t2 + t;
                            var d =   t3 -   t2;
                            var x = (_p0x*a) + ((_p1x*b) + tanForce * ((_v0outx*c) + (_v1inx*d)));
                            var y = (_p0y*a) + ((_p1y*b) + tanForce * ((_v0outy*c) + (_v1iny*d)));
                            path.push(["L", x, y]);
                        }
                        // p1 to p2
                        for (var t=0.0; t<1.0+di; t+=di) {
                            var t2 = t*t;
                            var t3 = t2*t;
                            var _2t3 = 2.0*t3;
                            var _3t2 = 3.0*t2;
                            var a = _2t3 - _3t2 + 1.0;
                            var b =-_2t3 + _3t2;
                            var c =   t3 - 2.0*t2 + t;
                            var d =   t3 -   t2;
                            var x = (_p1x*a) + ((_p2x*b) + tanForce * ((_v1outx*c) + (_v2inx*d)));
                            var y = (_p1y*a) + ((_p2y*b) + tanForce * ((_v1outy*c) + ( _v2iny*d)));
                            path.push(["L", x, y]);
                        }
                        
                        // texts update
                        var offset = 10;
                        p0t.attr({x:_p0x,y:offset+_p0y+_p0r});
                        p0outt.attr({x:_p0outx,y:offset+_p0outy+_p0outr});
                        p1int.attr({x:_p1inx,y:offset+_p1iny+_p1inr});
                        p1t.attr({x:_p1x,y:offset+_p1y+_p1r});
                        p1outt.attr({x:_p1outx,y:offset+_p1outy+_p1outr});
                        p2int.attr({x:_p2inx,y:offset+_p2iny+_p2inr});
                        p2t.attr({x:_p2x,y:offset+_p2y+_p2r});
                        
                        curve.attr({path: path});
                                                
                        var p = 0;
                        
                        //p = [["M", p0in.attr("cx"), p0in.attr("cy")], ["L", p0.attr("cx"), p0.attr("cy")]];
                        //p0curvein.attr({path: fixArrow(p, p0.attr("r"))});                        
                        p = [["M", p0.attr("cx"), p0.attr("cy")], ["L", p0out.attr("cx"), p0out.attr("cy")]];
                        p0curveout.attr({path: fixArrow(p, p0out.attr("r"))});                        
                        p = [["M", p1in.attr("cx"), p1in.attr("cy")], ["L", p1.attr("cx"), p1.attr("cy")]];
                        p1curvein.attr({path: fixArrow(p, p1.attr("r"))});                        
                        p = [["M", p1.attr("cx"), p1.attr("cy")], ["L", p1out.attr("cx"), p1out.attr("cy")]];
                        p1curveout.attr({path: fixArrow(p, p1out.attr("r"))});                        
                        p = [["M", p2in.attr("cx"), p2in.attr("cy")], ["L", p2.attr("cx"), p2.attr("cy")]];
                        p2curvein.attr({path: fixArrow(p, p2.attr("r"))});                        
                        //p = [["M", p2.attr("cx"), p2.attr("cy")], ["L", p2out.attr("cx"), p2out.attr("cy")]];
                        //p2curveout.attr({path: fixArrow(p, p2out.attr("r"))});
                    };
                        
                    updatePath();                       
                    
                    // p0
                    
                    p0.update = function (x, y, u) {
                        var X = this.attr("cx") + x,
                            Y = this.attr("cy") + y;
                        this.attr({cx: X, cy: Y});
                        //p0in.update(x, y, false);
                        p0out.update(x, y, false);
                        if (u) { updatePath(); }
                    };
                    /*
                    p0in.update = function (x, y, u) {
                        var X = this.attr("cx") + x,
                            Y = this.attr("cy") + y;
                        this.attr({cx: X, cy: Y,});
                        if (u) { updatePath(); }
                    };
                    */
                    p0out.update = function (x, y, u) {
                        var X = this.attr("cx") + x,
                            Y = this.attr("cy") + y;
                        this.attr({cx: X, cy: Y});
                        if (u) { updatePath(); }
                    };
                
                    // p1
                    
                    p1.update = function (x, y, u) {
                        var X = this.attr("cx") + x,
                            Y = this.attr("cy") + y;
                        this.attr({cx: X, cy: Y});
                        p1in.update(x, y, false);
                        p1out.update(x, y, false);
                        if (u) { updatePath(); }
                    };
                    p1in.update = function (x, y, u) {
                        var X = this.attr("cx") + x,
                            Y = this.attr("cy") + y;
                        this.attr({cx: X, cy: Y});
                        if (u) { updatePath(); }
                    };
                    p1out.update = function (x, y, u) {
                        var X = this.attr("cx") + x,
                            Y = this.attr("cy") + y;
                        this.attr({cx: X, cy: Y});
                        if (u) { updatePath(); }
                    };
                
                    // p2
                    
                    p2.update = function (x, y, u) {
                        var X = this.attr("cx") + x,
                            Y = this.attr("cy") + y;
                        this.attr({cx: X, cy: Y});
                        p2in.update(x, y, false);
                        //p2out.update(x, y, false);
                        if (u) { updatePath(); }
                    };
                    p2in.update = function (x, y, u) {
                        var X = this.attr("cx") + x,
                            Y = this.attr("cy") + y;
                        this.attr({cx: X, cy: Y});
                        if (u) { updatePath(); }
                    };
                    /*
                    p2out.update = function (x, y, u) {
                        var X = this.attr("cx") + x,
                            Y = this.attr("cy") + y;
                        this.attr({cx: X, cy: Y});
                        if (u) { updatePath(); }
                    };
                    */
                    controls.drag(move, up);
                }
                function move(dx, dy) {
                    this.update(dx - (this.dx || 0), dy - (this.dy || 0), true);
                    this.dx = dx;
                    this.dy = dy;
                }
                function up() {
                    this.dx = this.dy = 0;
                }
                curve(225, 391, 202, 297, 475, 307, 568, 423, 173, 505, 228, 672, 810, 404, 1129, 457, 695, 271, "hsb(.3, .75, .75)");
            };