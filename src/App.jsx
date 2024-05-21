import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useDoubleClick } from './custom hooks/DoubleClick';

function App() {
  const canvasRef = useRef(null);

  const [lineStartPosition, setLineStartPosition] = useState({x: 300, y: 400})
  const [lineEndPosition, setLineEndPosition] = useState({ x: 300, y: 400 })
  const [readyPoly, setReadyPoly] = useState(false)
  const [isIntersect, setIsIntersect] = useState(false)

  const [linesHistory, setLinesHistory] = useState(
    
    [lineStartPosition]

  //   [
  //     {
  //         "x": 100,
  //         "y": 100
  //     },
  //     {
  //         "x": 200,
  //         "y": 400
  //     },
  //     {
  //         "x": 400,
  //         "y": 400
  //     },
  //     {
  //         "x": 500,
  //         "y": 100
  //     }
  //     ,
  //     {
  //         "x": 100,
  //         "y": 100
  //     }
  // ]
    )


    function isHorizontalLine(point1, point2) {
      const deltaX = Math.abs(point2.x - point1.x);
      const deltaY = Math.abs(point2.y - point1.y);
      return deltaX > deltaY;
  }


    function onSegment(p, q, r) {
      if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
          q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) {
          return true;
      }
      return false;
  }
  
  function orientation(p, q, r) {
      let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
      if (val === 0) return 0; // współliniowe
      return (val > 0) ? 1 : 2; // 1 -> zgodnie z ruchem wskazówek zegara, 2 -> przeciwnie do ruchu wskazówek zegara
  }
  
  function doIntersect(p1, q1, p2, q2) {
      let o1 = orientation(p1, q1, p2);
      let o2 = orientation(p1, q1, q2);
      let o3 = orientation(p2, q2, p1);
      let o4 = orientation(p2, q2, q1);
  
      if (o1 !== o2 && o3 !== o4) return true;
  

      //ponizej tego działa git
      // if (o1 === 0 && onSegment(p1, p2, q1)) return true;
      // if (o2 === 0 && onSegment(p1, q2, q1)) return true;
      // if (o3 === 0 && onSegment(p2, p1, q2)) return true;
      // if (o4 === 0 && onSegment(p2, q1, q2)) return true;
  
      return false;
  }
  
  function isSameEdge(p1, q1, p2, q2) {
      return (p1.x === p2.x && p1.y === p2.y && q1.x === q2.x && q1.y === q2.y) ||
             (p1.x === q2.x && p1.y === q2.y && q1.x === p2.x && q1.y === p2.y);
  }
  
  function polygonHasIntersectingEdges(linesHistory) {
      const n = linesHistory.length;
      for (let i = 0; i < n - 1; ++i) {
          for (let j = i + 2; j < n - 1; ++j) {
              if ((i === 0 && j === n - 2) || Math.abs(i - j) === 1) continue; 
  
              let p1 = linesHistory[i];
              let q1 = linesHistory[i + 1];
              let p2 = linesHistory[j];
              let q2 = linesHistory[j + 1];
  
              if (isSameEdge(p1, q1, p2, q2)) continue;
  
              if (doIntersect(p1, q1, p2, q2)) {
                  console.log(`Intersection found between edges [${i}, ${i+1}] and [${j}, ${j+1}]`);
                  setIsIntersect(true)
                  return true;
              }
          }
      }
      setIsIntersect(false)
      return false;
  }
  
  

const calcArea = () => {
  let sum = 0;
  
  for (let i = 0; i < linesHistory.length - 1; i++) {
    sum += (linesHistory[i].x * linesHistory[i+1].y) - (linesHistory[i+1].x * linesHistory[i].y);
  }

  const area = Math.abs(sum) / 2;
  return area
};

// console.log('czy sie przecinają?', polygonHasIntersectingEdges(linesHistory)); // Zwraca false, bo krawędzie się nie przecinają


// calcArea();

  const drawLinesHistory = () =>{
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation='source-over';


    if(!readyPoly){
  
    }



    if(readyPoly){

      ctx.beginPath();
      ctx.moveTo(linesHistory[0].x, linesHistory[0].y);

      linesHistory.forEach((line, i) => {
        if (i < linesHistory.length - 1) {
          const x1 = line.x;
          const y1 = line.y;
          const x2 = linesHistory[i + 1].x;
          const y2 = linesHistory[i + 1].y;
          const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          
          
          if (distance > 0) { // Sprawdzenie, czy odległość jest większa od zera
     
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.stroke();
  
          }
        }
      });

      ctx.fillStyle = 'rgba(42, 17, 145, 0.2)'
      ctx.fill()
      ctx.closePath()



      linesHistory.forEach((line, i) => {
        if (i < linesHistory.length - 1) {
          const x1 = line.x;
          const y1 = line.y;
          const x2 = linesHistory[i + 1].x;
          const y2 = linesHistory[i + 1].y;
          const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          const xMid = (x1 + x2) / 2; // Współrzędna x środka odcinka
          const yMid = (y1 + y2) / 2; // Współrzędna y środka odcinka


          const cursorDistance = Math.sqrt(Math.pow(lineEndPosition.x - xMid, 2) + Math.pow(lineEndPosition.y - yMid, 2));
          ctx.beginPath();
          ctx.arc(xMid, yMid, 10, 0, Math.PI * 2); // Rysowanie kółka na środku odcinka
          
          if (distance > 0) { // Sprawdzenie, czy odległość jest większa od zera

  
            ctx.fillStyle = cursorDistance<10 ? 'rgba(109, 109, 109, 1)' : 'rgba(67, 67, 67, 1)'

            ctx.fill();
      
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText(i, xMid - 4, yMid + 4); // Wyświetlanie numeru indeksu w kółku

          }
          else{
            ctx.fillStyle = 'orange'
            ctx.fill();

            ctx.fillStyle = 'red';
            ctx.font = '12px Arial';
            ctx.fillText(i, xMid - 4, yMid + 4); // Wyświetlanie numeru indeksu w kółku


          }
          ctx.closePath()
        }
      });



    }
    else{

      ctx.beginPath()
      ctx.arc(linesHistory[0].x, linesHistory[0].y, 20, 0, Math.PI * 2); // Rysowanie kółka na środku odcinka
      ctx.fillStyle = 'rgba(229, 191, 79, 0.24)';
      ctx.fill();
      ctx.closePath()

      linesHistory.forEach((line, i) => {
        if (i < linesHistory.length - 1) {
          const x1 = line.x;
          const y1 = line.y;
          const x2 = linesHistory[i + 1].x;
          const y2 = linesHistory[i + 1].y;
          const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          
          
          if (distance > 0) { // Sprawdzenie, czy odległość jest większa od zera
            const xMid = (x1 + x2) / 2; // Współrzędna x środka odcinka
            const yMid = (y1 + y2) / 2; // Współrzędna y środka odcinka
  
  
            const cursorDistance = Math.sqrt(Math.pow(lineEndPosition.x - xMid, 2) + Math.pow(lineEndPosition.y - yMid, 2));
  
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 5;
            ctx.stroke();
  
            ctx.closePath()
      
            ctx.beginPath();
            ctx.arc(xMid, yMid, 10, 0, Math.PI * 2); // Rysowanie kółka na środku odcinka
  
  
            ctx.fillStyle = cursorDistance<10 ? 'rgba(109, 109, 109, 1)' : 'rgba(67, 67, 67, 1)'
        

            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText(i, xMid - 4, yMid + 4); // Wyświetlanie numeru indeksu w kółku
            ctx.closePath()
          }
        }
      });
    }

    
    polygonHasIntersectingEdges(linesHistory)
   
    
    
  }


  // ponizej preview lini, który jest zakomentowany bo sie buguje
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawLine = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if(!readyPoly){
        ctx.beginPath();
        ctx.moveTo(lineStartPosition.x, lineStartPosition.y);
        ctx.lineTo(lineEndPosition.x, lineEndPosition.y);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.stroke();
      }
      // console.log('usuwam')
      drawLinesHistory()

    };

    const updateLineEndPosition = () => {
      drawLine();
      // requestAnimationFrame(updateLineEndPosition);
    };

    updateLineEndPosition();

    return () => {
      cancelAnimationFrame(updateLineEndPosition);
    };
  }, [lineEndPosition, lineStartPosition]);

  // useEffect(()=>{

  //   console.log('rysuje')
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext('2d');

  //   console.log(linesHistory)
  //   console.log('xd', linesHistory.slice(1))

  //   //nw czy musi byc
  //   // drawLinesHistory()


  // },[linesHistory])


  const editLineHistroy = (x,y) =>{


    const newLine = {
      x: x,
      y: y
    }
    console.log(newLine)


    console.log([...linesHistory, newLine])
    setLinesHistory([...linesHistory, newLine])

  }

  const handleClick = (event) =>{

    if(!readyPoly)
    {

      const cursorDistanceFromStart = Math.sqrt(Math.pow(linesHistory[0].x - event.clientX, 2) + Math.pow(linesHistory[0].y - event.clientY, 2));

  
      if(cursorDistanceFromStart<20){
        const newPos = {
          x: linesHistory[0].x,
          y: linesHistory[0].y,
        }
    
        editLineHistroy(linesHistory[0].x, linesHistory[0].y)
    
        setLineEndPosition(newPos)
        setReadyPoly(true)
      }
    else{

      // x: isHorizontalLine(linesHistory[linesHistory.length-1], eventToObject) ?  event.clientX : linesHistory[linesHistory.length-1].x,
      // y: isHorizontalLine(linesHistory[linesHistory.length-1], eventToObject) ? linesHistory[linesHistory.length-1].y : event.clientY



      const newPos = {
        x: lineEndPosition.x,
        y: lineEndPosition.y
      }
  
      editLineHistroy(newPos.x, newPos.y)
      setLineStartPosition(newPos)
    }
  

    }
   

    console.log('kliknieto')

  }



  onmousedown = (event) => {
    linesHistory.forEach((line, i) => {
        if (i < linesHistory.length - 1) {
            const x1 = line.x;
            const y1 = line.y;
            const x2 = linesHistory[i + 1].x;
            const y2 = linesHistory[i + 1].y;

            const xMid = (x1 + x2) / 2; // Współrzędna x środka odcinka
            const yMid = (y1 + y2) / 2; // Współrzędna y środka odcinka
            
            let cursorDistance = Math.sqrt(Math.pow(lineEndPosition.x - xMid, 2) + Math.pow(lineEndPosition.y - yMid, 2));



          


            if (cursorDistance < 10) {
                onmousemove = (event) => {
                    console.log('ruszam linie', i);
                    console.log(event.screenX, event.screenY);

                  console.log('dlugosc', linesHistory.length, linesHistory)

                    // odejmuje 110 zeby cursor matchował
                    if(i===0){

                      if(isHorizontalLine(linesHistory[i + 1], linesHistory[i])){
                        linesHistory[i + 1].y = event.screenY - 110;
                        linesHistory[i].y = event.screenY - 110;
                        linesHistory[(linesHistory.length)-1].y = event.screenY - 110;
                      }else{
                        linesHistory[i + 1].x = event.screenX ;
                        linesHistory[i].x = event.screenX ;
                        linesHistory[(linesHistory.length)-1].x = event.screenX ;
                      }
   
                    }
                    else if(i===linesHistory.length-2){
                      
                      if(isHorizontalLine(linesHistory[i + 1], linesHistory[i])){
                        linesHistory[0].y = event.screenY - 110;
                        linesHistory[linesHistory.length-1].y = event.screenY - 110;
                        linesHistory[i].y = event.screenY - 110;
                      }
                      else{
                        linesHistory[0].x = event.screenX ;
                        linesHistory[linesHistory.length-1].x = event.screenX
                        linesHistory[i].x = event.screenX ;
                      }

                    }
                    else{

                      if(isHorizontalLine(linesHistory[i + 1], linesHistory[i])){
                        linesHistory[i + 1].y = event.screenY - 110;
                        linesHistory[i].y = event.screenY - 110;
                      }
                      else{
                        linesHistory[i + 1].x = event.screenX ;
                        linesHistory[i].x = event.screenX ;
                      }
               
                    }

                };

                onmouseup = (event) => {
                    onmousemove = null;
                };
            }
        }
    });
};




  const handleDoubleClick = () =>{

    console.log('dbl click')

    const newPos = {
      x: linesHistory[0].x,
      y: linesHistory[0].y,
    }

    editLineHistroy(linesHistory[0].x, linesHistory[0].y)

    setLineEndPosition(newPos)

  }



  const handleMouseMove = (event) => {

    console.log(lineEndPosition)

    console.log(Math.abs(linesHistory[linesHistory.length-1].x-event.clientX))
    console.log(Math.abs(linesHistory[linesHistory.length-1].y-event.clientY))


    const eventToObject = {
      x: event.clientX,
      y: event.clientY
    }

    // const horizontalLength = Math.abs(linesHistory[linesHistory.length-1].x-event.clientX)

    // const verticalLength = Math.abs(linesHistory[linesHistory.length-1].y-event.clientY)

    // console.log(horizontalLength>verticalLength ? 'poziomo' : 'pionowo')

    console.log(isHorizontalLine(linesHistory[linesHistory.length-1], eventToObject))


    if(!readyPoly){
      const newEndPost = {
        x: isHorizontalLine(linesHistory[linesHistory.length-1], eventToObject) ?  event.clientX : linesHistory[linesHistory.length-1].x,
        y: isHorizontalLine(linesHistory[linesHistory.length-1], eventToObject) ? linesHistory[linesHistory.length-1].y : event.clientY
      }

    setLineEndPosition(newEndPost)

    }
    else{
      const newEndPost = {
        x: event.clientX,
        y: event.clientY
      }

      setLineEndPosition(newEndPost)

    }
    

    
  };

  return (

    <div className='xd'>

<div className="counter">
        {
          linesHistory.map((line, i) => {
            let distance = null; // Zmienna na odległość, inicjalnie ustawiona na null

            if (i < linesHistory.length - 1) {
              distance = Math.sqrt(
                Math.pow(linesHistory[i + 1].x - line.x, 2) +
                Math.pow(linesHistory[i + 1].y - line.y, 2)
              );
              // console.log("Odległość między punktami", i, "i", i + 1, "wynosi:", distance);
            }
            
            return (distance !== 0 ? <span key={i}>Linia nr {i} {Math.floor(distance)}, ({line.x}, {line.y}) </span> : null)// Zwraca odległość jako element JSX lub null, jeśli odległość jest null
          })
        }

        <p>Pole całkowite {isIntersect ? 'Ściany nie mogą się przecinać!' : calcArea()} </p>
        <p>{lineEndPosition.x}, {lineEndPosition.y}</p>
    
      </div>
    
    <div className="canvas">
      <canvas ref={canvasRef} width="1920" height="1080" onMouseMove={handleMouseMove} onClick={handleClick}></canvas>
    </div>
    
    </div>
  
  
  );
}

export default App;
