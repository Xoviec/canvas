import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useDoubleClick } from './custom hooks/DoubleClick';

function App() {
  const canvasRef = useRef(null);

  const [lineStartPosition, setLineStartPosition] = useState({x: 300, y: 400})
  const [lineEndPosition, setLineEndPosition] = useState({ x: 300, y: 400 })

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

const calcArea = () => {
  let sum = 0;
  
  for (let i = 0; i < linesHistory.length - 1; i++) {
    sum += (linesHistory[i].x * linesHistory[i+1].y) - (linesHistory[i+1].x * linesHistory[i].y);
  }

  const area = Math.abs(sum) / 2;
  console.log(area);
  return area
};

calcArea();

  const drawLinesHistory = () =>{
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation='source-over';


    // console.log(lineEndPosition.x, lineEndPosition.y)

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
    
          ctx.beginPath();
          ctx.arc(xMid, yMid, 10, 0, Math.PI * 2); // Rysowanie kółka na środku odcinka


          if(cursorDistance<10){
            ctx.fillStyle = 'green';
          }
          else{
            ctx.fillStyle = 'blue';

          }
          // ctx.fillStyle = 'blue'; // Kolor kółka
          ctx.fill();
    
          ctx.fillStyle = 'white';
          ctx.font = '12px Arial';
          ctx.fillText(i, xMid - 4, yMid + 4); // Wyświetlanie numeru indeksu w kółku
        }
      }
    });
    
    
  }


  // ponizej preview lini, który jest zakomentowany bo sie buguje
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawLine = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(lineStartPosition.x, lineStartPosition.y);
      ctx.lineTo(lineEndPosition.x, lineEndPosition.y);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 5;
      ctx.stroke();

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

  useEffect(()=>{

    console.log('rysuje')
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    console.log(linesHistory)
    console.log('xd', linesHistory.slice(1))


    drawLinesHistory()

    linesHistory.map((line, i)=>{

      ctx.beginPath();
      ctx.moveTo(line.x, line.y);
      ctx.lineTo(linesHistory[i+1]?.x, linesHistory[i+1]?.y);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 5;
      ctx.stroke();
      console.log(line)
    })

    console.log('rysuje sciezki')
    

  },[linesHistory])


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

    //to chyba mmozna wywalic
    // linesHistory.map((line, i) => {
    //   if (i < linesHistory.length - 1) {
    //     const x1 = line.x;
    //     const y1 = line.y;
    //     const x2 = linesHistory[i + 1].x;
    //     const y2 = linesHistory[i + 1].y;
    
    //       const xMid = (x1 + x2) / 2; // Współrzędna x środka odcinka
    //       const yMid = (y1 + y2) / 2; // Współrzędna y środka odcinka

    //       const cursorDistance = Math.sqrt(Math.pow(lineEndPosition.x - xMid, 2) + Math.pow(lineEndPosition.y - yMid, 2));

    //       if(cursorDistance<10){
    //         console.log('klikneto sciane', i)


    //       }
    //   }})
    
      //rysowanie


    //zamykanie figury
      // const newPos = {
      //   x: linesHistory[0].x,
      //   y: linesHistory[0].y,
      // }
  
      // editLineHistroy(linesHistory[0].x, linesHistory[0].y)
  
      // setLineEndPosition(newPos)


    const cursorDistanceFromStart = Math.sqrt(Math.pow(lineStartPosition.x - event.clientX, 2) + Math.pow(lineStartPosition.y - event.clientY, 2));

    console.log('dystnas', cursorDistanceFromStart)


    if(cursorDistanceFromStart<20){
      const newPos = {
        x: linesHistory[0].x,
        y: linesHistory[0].y,
      }
  
      editLineHistroy(linesHistory[0].x, linesHistory[0].y)
  
      setLineEndPosition(newPos)
    }
  else{
    const newPos = {
      x: event.clientX,
      y: event.clientY
    }



    editLineHistroy(event.clientX, event.clientY)
    setLineStartPosition(newPos)
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

            function isHorizontalLine(point1, point2) {
              const deltaX = Math.abs(point2.x - point1.x);
              const deltaY = Math.abs(point2.y - point1.y);
              return deltaX > deltaY;
          }

          


            if (cursorDistance < 10) {
                console.log('doszło do sigmy', cursorDistance, i);

          console.log('dupsko', isHorizontalLine(linesHistory[i + 1], linesHistory[i]))


                onmousemove = (event) => {
                    console.log('ruszam linie', i);
                    console.log(event.screenX, event.screenY);

                    // Aktualizacja punktu końcowego dla sąsiednich linii
                    // linesHistory[i + 1].x = event.screenX;


                  console.log('dlugosc', linesHistory.length, linesHistory)

                    // odejmuje 110 zeby cursor matchował
                    if(i===0){

                      if(isHorizontalLine(linesHistory[i + 1], linesHistory[i])){
                        linesHistory[i + 1].y = event.screenY - 110;

                        // linesHistory[i - 1].x = event.screenX;
                        linesHistory[i].y = event.screenY - 110;
  
                        linesHistory[(linesHistory.length)-1].y = event.screenY - 110;
                      }else{

                        linesHistory[i + 1].x = event.screenX ;

                        linesHistory[i].x = event.screenX ;
  
                        linesHistory[(linesHistory.length)-1].x = event.screenX ;
                      }
   
                    }
                    else if(i===linesHistory.length-2){
                      
                      console.log('donciu nol pamperam')


                      console.log('co to za linia', linesHistory[linesHistory.length-2])



                      if(isHorizontalLine(linesHistory[i + 1], linesHistory[i])){
                        linesHistory[0].y = event.screenY - 110;
                        linesHistory[linesHistory.length-1].y = event.screenY - 110;

  
                        // linesHistory[i - 1].x = event.screenX;
                        linesHistory[i].y = event.screenY - 110;

                      }
                      else{
                        linesHistory[0].x = event.screenX ;
                        linesHistory[linesHistory.length-1].x = event.screenX
  
                        // linesHistory[i - 1].x = event.screenX;
                        linesHistory[i].x = event.screenX ;
                      }






                    }
                    else{

                      if(isHorizontalLine(linesHistory[i + 1], linesHistory[i])){
                        linesHistory[i + 1].y = event.screenY - 110;
  
                        // linesHistory[i - 1].x = event.screenX;
                        linesHistory[i].y = event.screenY - 110;

                      }
                      else{
                        linesHistory[i + 1].x = event.screenX ;
  
                        // linesHistory[i - 1].x = event.screenX;
                        linesHistory[i].x = event.screenX ;
                      }
                      
               
                    }



                    // Tutaj możesz dodać więcej logiki związanej z aktualizacją sąsiednich linii

                    // Przerysuj canvas lub wykonaj inne operacje po aktualizacji
                    // redrawCanvas();
                };

                onmouseup = (event) => {
                    // Usuń zdarzenie mousemove
                    onmousemove = null;

                    // Zaktualizuj punkt końcowy dla sąsiednich linii
                    // linesHistory[i].x = event.screenX;
                    // linesHistory[i].y = event.screenY;

                    // Tutaj możesz dodać więcej logiki związanej z aktualizacją sąsiednich linii

                    // Przerysuj canvas lub wykonaj inne operacje po aktualizacji
                    // redrawCanvas();
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


  const myDoubleClickCallBack = useDoubleClick(handleClick, handleDoubleClick)

  const handleMouseMove = (event) => {


    const newEndPost = {
      x: event.clientX,
      y: event.clientY
    }
    
    // lineEndPosition.x = event.clientX;
    // lineEndPosition.y = event.clientY;

    setLineEndPosition(newEndPost)
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

        <p>Pole całkowite {calcArea()}</p>
    
      </div>
    
    <div className="canvas">


      <canvas ref={canvasRef} width="1920" height="1080" onMouseMove={handleMouseMove} onClick={handleClick}></canvas>
    </div>
    
    </div>
  
  
  );
}

export default App;
