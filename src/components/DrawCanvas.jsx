import { BsArrowLeftShort } from "react-icons/bs";
import React, { useRef, useEffect, useState } from 'react';
import { BsEraser } from 'react-icons/bs';
// site: https://miickii.github.io/srp-frontend/

let grid = Array(784).fill(0)

const DrawCanvas = ({ model, goBack }) => {
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);
    const [predicted, setPredicted] = useState(null);
    const doodle_labels = {"Æble": "🍎", "Træ": "🌳", "Pizza": "🍕", "Eiffeltårn": "🗼", "Donut": "🍩", "Fisk": "🐟", "Vinglas": "🍷", "Hund": "🐕", "Smiley": "🙂", "Gulerod": "🥕", "T-shirt": "👕", "Kaktus": "🌵", "Seng": "🛏️"}
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const [modelV, setModelV] = useState(1);

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 6;
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setCtx(ctx);
  
      let isDrawing = false;
      let lastX = 0;
      let lastY = 0;
  
      const draw = (e) => {
        if (!isDrawing) return;
        if (e.offsetX >= canvas.width || e.offsetX <= 0 || e.offsetY >= canvas.height || e.offsetY <= 0) return;
  
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

        lastX = e.offsetX;
        lastY = e.offsetY;
  
        const x = Math.floor(e.offsetX / 13);
        const y = Math.floor(e.offsetY / 13);


        grid[y*28+x] = 1;
      }
  
      canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        lastX = e.offsetX;
        lastY = e.offsetY;
      });
  
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', () => isDrawing = false);
      canvas.addEventListener('mouseout', () => isDrawing = false);
    }, []);

    const clearCanvas = () => {
        // Fill the whole canvas with the background color
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        grid = Array(784).fill(0);
        setPredicted(null);
    }

    const predict = async () => {
        // https://flask-production-19b6.up.railway.app/predict
        // api/predict
        const response = await fetch("https://flask-production-19b6.up.railway.app/predict", {
            method: 'POST',
            body: JSON.stringify({
                doodle: model===1, 
                pixels: grid
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const result = await response.json();
        console.log(result);
        setPredicted(result);
    }

    const changeModel = async (newModel) => {
        setModelV(newModel);
        // https://flask-production-19b6.up.railway.app/predict
        // api/predict
        const response = await fetch("api/change-model", {
            method: 'POST',
            body: JSON.stringify({
                digitModel: model===0, 
                newModel: newModel
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const result = await response.json();
    }

    return (
        <div className="relative h-screen w-screen flex flex-col items-center">
            <BsArrowLeftShort className="bg-teal-400 text-black text-3xl rounded-full 
            absolute left-3 top-3 border border-black cursor-pointer" onClick={goBack} />
            <div className="absolute right-10 top-3 flex flex-col items-center">
                <h1 className="text-white text-xl">Select Model:</h1>
                <div className="flex">
                    <div className={`border-2 border-black px-2 cursor-pointer ${modelV===1 ? "bg-teal-400" : "bg-gray-300"}`} onClick={() => changeModel(1)}>S</div>
                    <div className={`border-2 border-black px-2 cursor-pointer ${modelV===2 ? "bg-teal-400" : "bg-gray-300"}`} onClick={() => changeModel(2)}>M</div>
                    <div className={`border-2 border-black px-2 cursor-pointer ${modelV===3 ? "bg-teal-400" : "bg-gray-300"} ${model===0 && "hidden"}`} onClick={() => changeModel(3)}>L</div>
                </div>
            </div>
            <div className="mt-2 h-[26rem] flex flex-col items-center">
                {predicted && <>
                    <h1 className="mb-2"><span className='text-7xl text-white'>{predicted.top[0]}</span><span className="text-3xl text-white">{" (" + predicted.top[1] + "%)"}</span></h1>
                    <h1><span className='text-2xl text-gray-400'>{predicted.alt[0]}</span><span className="text-sm text-gray-400">{" (" + predicted.alt[1] + "%)"}</span></h1>
                </>}
            </div>
            <div className='relative mt-2'>
                <canvas
                ref={canvasRef}
                className="border-4 border-black rounded-lg shadow-xl"
                width={364}
                height={364}
                />
                <button className='absolute flex items-center justify-center top-2.5 right-4 w-8 h-8 bg-gray-100 border border-black rounded-full duration-300' onClick={() => clearCanvas()}>
                    <BsEraser size={18}/>
                </button>
            </div>
            <button className='rounded-lg bg-teal-400 border-2 border-black px-7 py-2 text-xl mt-6 duration-200 hover:scale-105 hover:bg-teal-500' onClick={() => predict()}>GÆT</button>
            <div className="h-full w-full flex flex-col justify-end">
                <div className="w-full flex">
                    <div className="w-[35%] border-b-4 border-black shadow"></div>
                    <div className="w-[30%] pt-2 border-t-4 border-x-4 border-black bg-gray-500 text-center text-2xl text-black underline">Tegn en af følgende:</div>
                    <div className="w-[35%] border-b-4 border-black"></div>
                </div>
                <div className="w-full flex bg-gray-500 py-4">
                    {model===1 && 
                        Object.keys(doodle_labels).map((label, i) => (
                            <div className="w-full flex justify-center items-center text-white" key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                                {hoveredIndex === i ? <span className="text-2xl">{label}</span> : <span className="text-4xl">{doodle_labels[label]}</span>}
                            </div>
                        ))
                    }
                    {model===0 &&
                        digits.map((d) => (
                            <div className="w-full text-center text-3xl text-gray-200" key={d}>{d}</div>
                        ))
                    }
                </div>
            </div>
        </div>
      );
}

export default DrawCanvas