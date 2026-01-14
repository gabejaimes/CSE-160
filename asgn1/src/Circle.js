class Circle{
    constructor() {
        this.type = "circle";
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.segments = 8;
    }

    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Draw
        var d = this.size/200.00 // delta

        let angleStep = 360.0 / this.segments;
        let centerPt = [xy[0], xy[1]];
        for(var angle = 0; angle < 360; angle += angleStep) {

            let angle1Rad = angle * Math.PI / 180.0;
            let angle2Rad = (angle + angleStep) * Math.PI / 180.0;

            let vec1 = [Math.cos(angle1Rad)*d, Math.sin(angle1Rad)*d];
            let vec2 = [Math.cos(angle2Rad)*d, Math.sin(angle2Rad)*d];

            let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
            let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];

            drawTriangle([xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]]);


        }
    }
}