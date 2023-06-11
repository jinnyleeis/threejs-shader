import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function () {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
  });

  const container = document.querySelector('#container');
  const canvas = document.createElement('canvas');
  canvas.width=300;
  canvas.height=300;

  //container.appendChild(renderer.domElement);
container.appendChild(canvas);

const gl =canvas.getContext('webgl');

//---- 쉐이더 ---//
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader,"...vertex shader code 내용...");//객체에 코드 부착 
gl.compileShader(vertexShader); // 컴파일 할 수 있게 된다. 

const fragmentShadaer = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShadaer,"...FRAGMENT shader code 내용...");//객체에 코드 부착 
gl.compileShader(fragmentShader); // 컴파일 할 수 있게 된다. 

//둘을 하나의 프로그램으로 연결해주는 과정 
const program = gl.createProgram();
gl.attachShader(program,vertexShader);
gl.attachShader(program,fragmentShadaer);

gl.linkProgram(program);
gl.useProgram(program);

//---위에서 프로그램을 만들었으니, 해당 프로그램에 데이터를 제공해주어야 한다!--//
//정점 데이터 넘겨주기
const vertices = new Float32Array([-1,-1,-1,1,1,1,-1,-1,1,1,1,-1]);
const vertexBuffer =gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);//정적으로 그려주겠다.

// 정점 데이터를 어떻게 해석해서 할당할지 정보를 넘겨주어야 한다! -2개의 단위로 정점 데이터를 끊어서 넘겨준다. 

//


  const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvasSize.width / canvasSize.height,
    0.1,
    100
  );
  camera.position.set(0, 0, 3);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  const createObject = () => {
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const geometry = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);
  };

  const resize = () => {
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerHeight;

    camera.aspect = canvasSize.width / canvasSize.height;
    camera.updateProjectionMatrix();

    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  const addEvent = () => {
    window.addEventListener('resize', resize);
  };

  const draw = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(() => {
      draw();
    });
  };

  const initialize = () => {
    createObject();
    addEvent();
    resize();
    draw();
  };//일단 한 번 실행 

  initialize();
}
