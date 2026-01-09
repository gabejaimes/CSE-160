// DrawRectangle.js
  let canvas, ctx;

  function angleBetween(v1, v2) {
    let dotProd = Vector3.dot(v1, v2);
    let v1Magnitude = v1.magnitude();
    let v2Magnitude = v2.magnitude();

    let cosAlpha = dotProd / (v1Magnitude * v2Magnitude);
    let alphaRads = Math.acos(cosAlpha);
    let alphaDegs = (180/Math.PI) * alphaRads
    return alphaDegs;
  } 

  function parseVec(idX, idY) {
    const x = parseFloat(document.getElementById(idX).value);
    const y = parseFloat(document.getElementById(idY).value);
    return {x,y};
  }

  function clearCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  function drawVector(v, color) {
    const scale = 20;
    const originX = canvas.width / 2;
    const originY = canvas.height / 2;

    const pixelX = v.elements[0] * scale;
    const pixelY = v.elements[1] * scale;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX + pixelX, originY - pixelY);
    ctx.stroke();
  }

  function handleDrawEvent() {

    const v1Vals = parseVec("v1x", "v1y");
    const v2Vals = parseVec("v2x", "v2y");
    

    if ([v1Vals.x, v1Vals.y, v2Vals.x, v2Vals.y].some(Number.isNaN)) return;
    clearCanvas();

    const v1 = new Vector3([v1Vals.x, v1Vals.y, 0]);
    const v2 = new Vector3([v2Vals.x, v2Vals.y, 0]);
    
    drawVector(v1, "red");
    drawVector(v2, "blue");

  }

  function handleDrawOperationEvent() {

    const v1Vals = parseVec("v1x", "v1y");
    const v2Vals = parseVec("v2x", "v2y");
    const scalar = parseFloat(document.getElementById("scalar").value);
    let operation = document.getElementById("operation").value;
    
    if ([v1Vals.x, v1Vals.y, v2Vals.x, v2Vals.y].some(Number.isNaN)) return;

    clearCanvas();
    
    const v1Copy= new Vector3([v1Vals.x, v1Vals.y, 0]);
    const v2Copy= new Vector3([v2Vals.x, v2Vals.y, 0]);

    drawVector(v1Copy, "red");
    drawVector(v2Copy, "blue");

    switch(operation) {
      case "add":
        v1Copy.add(v2Copy);
        drawVector(v1Copy, "green");

        break;
      case "subtract":
        v1Copy.sub(v2Copy);
        drawVector(v1Copy, "green");

        break;
      case "multiply":
        if (Number.isNaN(scalar)) return;
        v1Copy.mul(scalar);
        v2Copy.mul(scalar);

        drawVector(v1Copy, "green");
        drawVector(v2Copy, "green");
        break;
      case "divide":
        if (Number.isNaN(scalar)) return;
        v1Copy.div(scalar);
        v2Copy.div(scalar);

        drawVector(v1Copy, "green");
        drawVector(v2Copy, "green");

        break;
      case "magnitude":
        let v1Magnitude = v1Copy.magnitude();
        let v2Magnitude = v2Copy.magnitude();

        console.log("Magnitude v1:", v1Magnitude);
        console.log("Magnitude v2:", v2Magnitude);
        break;
      case "normalize":
        let v1Normalized = v1Copy.normalize();
        let v2Normalized = v2Copy.normalize();
        
        drawVector(v1Normalized, "green");
        drawVector(v2Normalized, "green");
        break;
      case "angle":
        let angle = angleBetween(v1Copy, v2Copy);
        console.log("Angle:", angle);
        break;
      case "area":
        let crossVector = Vector3.cross(v1Copy, v2Copy);
        let magnitude = crossVector.magnitude();
        let area = magnitude / 2;
        console.log("Area of the triangle:", area);
        break;
    }
  }



   function main() {
    // Retrieve <canvas> element                                  <- (1)
    canvas = document.getElementById('example');
    if (!canvas) {
      console.log('Failed to retrieve the <canvas> element');
      return;
    }

    // Get the rendering context for 2DCG                          <- (2)
    ctx = canvas.getContext('2d');

    // Draw a black rectangle                                       <- (3)
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color
    var v1 = new Vector3([2.25, 2.25, 0]);
    drawVector(v1, "red");
   }