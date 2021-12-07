const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext('2d'); 
// 캔버스 요소 안에서 픽셀에 접근하기 위해선, context variable 을 만드는 것을 먼저 해야함
const colors = document.getElementsByClassName("jsColor"); // 색상변경 관련
const range = document.getElementById("jsRange"); // 선 굵기 변경 관련
const mode = document.getElementById("jsMode"); // fill 버튼 관련
const saveBtn = document.getElementById("jsSave"); // save 버튼 관련
const removeBtn = document.getElementById("jsRemove"); // remove 버튼 관련

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 700;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
// pixel modifier 를 설정해줘야 그림판에 선을 그을 수 있다.


// Context의 기본 캔버스 설정
function defaultRect(){
  ctx.fillStyle = "white";                      // 배경색이 투명되는 오류 방지 => 배경색 미리 생성
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); // 배경색이 투명되는 오류 방지 => 배경색 미리 생성
}

defaultRect();
ctx.strokeStyle = INITIAL_COLOR; // 기본 색상 검정색으로 설정
ctx.fillStyle = INITIAL_COLOR;   // 다시 값 검정색으로 초기화
ctx.lineWidth = 2.5;             // 기본 선 굵기 설정

let painting = false;
let filling = false;

function stopPainting(){
  painting = false;
}

function startPainting(){
  painting = true;
}

function onMouseMove(event) {
  // 여기서 모든 움직임을 감지하고 , 라인을 만든다.
  const X = event.offsetX;
  const Y = event.offsetY;
  if(!painting){
    ctx.beginPath();
    ctx.moveTo(X,Y);
  } else {
    ctx.lineTo(X,Y);
    ctx.stroke();
    // 마우스를 움직이는 동안 계속 발생하는 것
  }
}

function handleColorClick(event){
  const color = event.target.style.backgroundColor; // 클릭한 컬러를 변수로 저장
  ctx.strokeStyle = color; // 기존의 기본 strokeStyle 을 target에 있는 색상으로 override함
  ctx.fillStyle = color;   // 색상 변경 클릭 시, fillStyle(paint해주는)도 색상 override함
}

function handleRangeChange(event){
  const size = event.target.value;
  ctx.lineWidth = size;
}

function handleModeClick(event){
  if(filling === true){
    filling = false;
    mode.innerText = "Fill";
  } else {
    filling = true;
    mode.innerText = "Paint";
    
  }
}

function handleCanvasClick(){
  if(filling){
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }
}

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


if(canvas){
  canvas.addEventListener("mousemove", onMouseMove);   // 마우스 움직임 감지
  canvas.addEventListener("mousedown", startPainting); // 마우스 클릭 시, 페인팅 시작
  canvas.addEventListener("mouseup", stopPainting);    // 마우스를 떼면, 페인팅 종료
  canvas.addEventListener("mouseleave", stopPainting); // 마우스가 캔버스를 벗어나면, 페인팅 종료
  canvas.addEventListener("click", handleCanvasClick); // 캔버스 클릭 시, filling이 true라면 캔버스 사이즈 만큼의 사각형 생성
  canvas.addEventListener("contextmenu", handleCM);    // 오른쪽 마우스 클릭으로 이미지저장 방지
}

Array.from(colors).forEach(color => 
  color.addEventListener("click", handleColorClick)
);
// colors 가 배열로 구성 되어 있으므로, for Each를 사용해서 각각의 컬러를 가져오기

if(range){
  range.addEventListener("input", handleRangeChange)
}

if(mode){
  mode.addEventListener("click", handleModeClick)
}

if(saveBtn){
  saveBtn.addEventListener("click", handleSaveClick)
}

if(removeBtn){
  removeBtn.addEventListener("click", defaultRect)
}