const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext('2d'); 
// 캔버스 요소 안에서 픽셀에 접근하기 위해선, context variable 을 만드는 것을 먼저 해야함
const colors = document.getElementsByClassName("jsColor");    // 색상변경 관련
const colorPicker = document.getElementById("jsColorPicker"); // 컬러픽커 관련
const range = document.getElementById("jsRange");             // 선 굵기 변경 관련
const mode = document.getElementById("jsMode");               // paint 버튼 관련
const fillBtn = document.getElementById("jsFill");             // fill 버튼 관련
const saveBtn = document.getElementById("jsSave");            // save 버튼 관련
const removeBtn = document.getElementById("jsRemove");        // remove 버튼 관련
const rectBtn = document.getElementById("jsRect");            // 사각형 버튼 관련

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 700;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
// pixel modifier 를 설정해줘야 그림판에 선을 그을 수 있다.


// Context의 기본 캔버스 설정
function defaultRect(){
  ctx.fillStyle = "white";                      // 배경색이 투명되는 오류 방지 => 배경색 미리 생성
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); // 배경색이 투명되는 오류 방지 => 배경색 미리 생성
  const color = localStorage.getItem('color');
  ctx.fillStyle = color;
}

defaultRect();
ctx.strokeStyle = INITIAL_COLOR; // 기본 색상 검정색으로 설정
ctx.fillStyle = INITIAL_COLOR;   // 다시 값 검정색으로 초기화
ctx.lineWidth = 2.5;             // 기본 선 굵기 설정

let painting = false;
let filling = false;
let rectDrawing = false;

// 구분 버튼
let currentPaint = true;
let currentRect = false;

let startPX = 0; 
let startPY = 0;
let startX = 0;
let startY = 0;

// Paint
function stopPainting(){
  if(currentPaint === true){
    painting = false;
  }
}

function startPainting(){
  if(currentPaint === true){
    painting = true;
  }
}

function onMouseMove(event) {
  if(currentPaint === true){
    const X = event.offsetX;
    const Y = event.offsetY;
    if(!painting){
      ctx.beginPath();
      ctx.moveTo(X,Y);
    } else {
      ctx.lineTo(X,Y);
      ctx.stroke();
    } 
  }
}

function handleModeClick(){
  if(!currentPaint){
    currentPaint = true;
    filling = false;
    currentRect = false;
  }
}


// Color
function handleColorClick(event){
  localStorage.clear();
  const color = event.target.style.backgroundColor; // 클릭한 컬러를 변수로 저장
  ctx.strokeStyle = color; // 기존의 기본 strokeStyle 을 target에 있는 색상으로 override함
  ctx.fillStyle = color;   // 색상 변경 클릭 시, fillStyle(paint해주는)도 색상 override함
  localStorage.setItem('color', color);
}

function handleColorPicker(event){
  localStorage.clear();
  const color = event.target.value;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  colorPicker.style.backgroundColor = color;
  localStorage.setItem('color', color);
}


// Range
function handleRangeChange(event){
  const size = event.target.value;
  ctx.lineWidth = size;
}


// fill 
function handleFillClick(event){
  if(!filling){
    filling = true;
    currentRect = false;
    currentPaint = false;
  }
}

function handleCanvasClick(){
  if(filling){
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }
}


// Save
function handleCM(event){
  event.preventDefault();
}

function handleSaveClick(){
  const image = canvas.toDataURL(); // () 안은 이미지파일의 타입을 기입 (아무것도 기입하지 않는다면, png파일이 기본)
  const link = document.createElement("a");
  link.href = image; // href 는 이미지(URL)가 되어야하고
  link.download = "PaintJS🎨"; // 다운로드는 그 이름을 가져야함
  link.click();
}


// Rect
function startDrawRect(event){
  if(currentRect === true){
    rectDrawing = true;
    startPX = event.pageX;
    startPY = event.pageY;
    startX = event.offsetX;
    startY = event.offsetY;
    ctx.beginPath();
  }
}

function stopDrawRect(event){
  if(currentRect === true){
    rectDrawing = false;
    ctx.stroke();
    ctx.closePath();
  }
}

function onMouseMoveRect(event){
  if(currentRect === true){
    const x = event.pageX;
    const y = event.pageY;
    const offsetX = event.offsetX;
    const offsetY = event.offsetY;
    if(!rectDrawing){
      
    } else {
      const width = x-startPX;
      const height = y-startPY;
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      ctx.rect(startX, startY, width, height);
    }
  }
}

function handleRectClick(){
  if(!currentRect){
    currentRect = true;
    filling = false;
    currentPaint = false;
  }
}



if(canvas){
  canvas.addEventListener("mousemove", onMouseMove);   // 마우스 움직임 감지
  canvas.addEventListener("mousedown", startPainting); // 마우스 클릭 시, 페인팅 시작
  canvas.addEventListener("mouseup", stopPainting);    // 마우스를 떼면, 페인팅 종료
  canvas.addEventListener("mouseleave", stopPainting); // 마우스가 캔버스를 벗어나면, 페인팅 종료
  canvas.addEventListener("click", handleCanvasClick); // 캔버스 클릭 시, filling이 true라면 캔버스 사이즈 만큼의 사각형 생성
  canvas.addEventListener("contextmenu", handleCM);    // 오른쪽 마우스 클릭으로 이미지저장 방지

  canvas.addEventListener("mousemove", onMouseMoveRect);   
  canvas.addEventListener("mousedown", startDrawRect); 
  canvas.addEventListener("mouseup", stopDrawRect);    
  canvas.addEventListener("mouseleave", stopDrawRect);
}

Array.from(colors).forEach(color => 
  color.addEventListener("click", handleColorClick)
);
// colors 가 배열로 구성 되어 있으므로, for Each를 사용해서 각각의 컬러를 가져오기

if(colorPicker){
  colorPicker.addEventListener("input", handleColorPicker)
}

if(range){
  range.addEventListener("input", handleRangeChange)
}

if(mode){
  mode.addEventListener("click", handleModeClick)
}

if(fillBtn){
  fillBtn.addEventListener("click", handleFillClick)
}

if(saveBtn){
  saveBtn.addEventListener("click", handleSaveClick)
}

if(removeBtn){
  removeBtn.addEventListener("click", defaultRect)
}

if(rectBtn){
  rectBtn.addEventListener("click", handleRectClick)
}