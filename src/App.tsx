import {
  Dummy,
  Find,
  HTML,
  Joystick,
  keyboard,
  Model,
  Reticle,
  ThirdPersonCamera,
  types,
  usePreload,
  useSpring,
  useWindowSize,
  World,
  Editor,
} from "lingo3d-react";
import { useEffect, useRef, useState } from "react";
import AnimText from "@lincode/react-anim-text";
import { lessonInfo } from "./data";
import "./App.css";
const Game = () => {
  // camera XYZ depends on whether user is looking at designated artwork
  // 相机的XYZ取决于用户是否瞄准指定的艺术品
  const lessonInfoFalse = new Array(lessonInfo.length).fill(false)
  const [mouseOver, setMouseOver] = useState([...lessonInfoFalse]);
  const [num, setNum] = useState(0)
  const camX = mouseOver[num] ? 50 : 0;
  const camY = mouseOver[num] ? 100 : 100;
  const camZ = mouseOver[num] ? 100 : 300;

  // Camera spring animation
  // 相机的弹簧动画
  const xSpring = useSpring({ to: camX, bounce: 0 });
  const ySpring = useSpring({ to: camY, bounce: 0 });
  const zSpring = useSpring({ to: camZ, bounce: 0 });

  // adjust camera FOV based on window size
  // 根据窗口大小调整相机的FOV
  const windowSize = useWindowSize();
  const fov = windowSize.width < windowSize.height ? 100 : 90;

  const dummyRef = useRef<types.Dummy>(null);

  // keyboard WASD controls
  // 键盘WASD控制
  useEffect(() => {
    keyboard.onKeyPress = (_, keys) => {
      const dummy = dummyRef.current;
      if (!dummy) return;

      if (keys.has("w")) dummy.strideForward = -5;
      else if (keys.has("s")) dummy.strideForward = 5;
      else dummy.strideForward = 0;

      if (keys.has("a")) dummy.strideRight = 5;
      else if (keys.has("d")) dummy.strideRight = -5;
      else dummy.strideRight = 0;
    };
  }, []);

  return (
    <World
      defaultLight="env.hdr"
      skybox="env.hdr"
      // bloom
      // bloomStrength={0.3}
      // bloomRadius={1}
      // bloomThreshold={1.9}
      outlineHiddenColor="red"
      outlinePulse={1000}
      outlinePattern="pattern.jpeg"
      repulsion={1}
    >
      {/* <Editor /> */}
      <Model src="gallery.glb" scale={20} physics="map">
        {lessonInfo.map((item, index) => (
          <Find
            key={item.id}
            name={item.find}
            outline={mouseOver[index]}
            onMouseMove={(e) => {
             
              if (!mouseOver[index] && e.distance < 600) {
                let newLessonInfoFalse = [...lessonInfoFalse].map((v, i) => {
                  if (i === index) return true
                  return false
                })

                setMouseOver(newLessonInfoFalse)
                setNum(index)
              }
            }}
            onMouseOut={(e) => { 
              setTimeout(()=>{
                setMouseOver(lessonInfoFalse)
              },300)
            }}
          >
            {mouseOver[index] && (
              <HTML>
                <div
                  style={{
                    marginTop: '-50px',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    letterSpacing: '2px',
                    color: "white",
                    width: "500px",
                    padding: '16px',
                  }}
                >
                  <AnimText
                    style={{ fontWeight: "bold", fontSize: 20 }}
                    duration={1000}
                  >
                    {item.name}
                  </AnimText>
                  <span
                    style={{ fontSize: 14 }}
                  >
                    {item.intro}
                  </span>
                </div>
              </HTML>
            )}
          </Find>
        ))}
        {/* <Find
          name="a6_CRN.a6_0"
          outline={mouseOver}
          onMouseMove={(e) => {
            if (!mouseOver && e.distance < 700) {
              setMouseOver(true)
            }
          }}
          onMouseOut={(e) => { setMouseOver(false) }}
        >
          {mouseOver && (
            <HTML>
              <div
                style={{
                  marginTop: '-50px',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  letterSpacing: '2px',
                  color: "white",
                  width: "500px",
                  padding: '16px',
                }}
              >
                <AnimText
                  style={{ fontWeight: "bold", fontSize: 20 }}
                  duration={1000}
                >
                  加油科学课
                </AnimText>
                <AnimText
                  style={{ fontSize: 14 }}
                  duration={0}
                >
                  紧密贴合国家新课标科学课要求。
                  课程中，科学家将科学知识深入浅出的讲解，
                  由知识引发学生对世界的思考，
                  让孩子发现身边的科学现象,
                  在学习中培养学生对科学学习的兴趣。
                  通过探究、实践完成有趣的课堂学习，
                  让学生直观理解知识点、启蒙科学精神，
                  掌握动植物，地球，材料等基础知识内容。
                  培养学生掌握科学探究的过程和方法，
                  尝试应用于科学探究活动中，
                  逐步学会科学的看问题、想问题。
                  并在学习的过程中提高学科学，爱科学的兴趣，
                  对生活保持好奇心，
                  通过沟通，协作，实验，自主探究，解决问题。
                </AnimText>
              </div>
            </HTML>
          )}
        </Find> */}
      </Model>

      <ThirdPersonCamera
        mouseControl
        active
        innerY={ySpring}
        innerZ={zSpring}
        innerX={xSpring}
        fov={fov}
        lockTargetRotation="dynamic-lock"
      >
        <Dummy
          ref={dummyRef}
          physics="character"
          x={-914.58}
          y={-887.57}
          z={-108.62}
          rotationY={66.97}
          roughnessFactor={0}
          metalnessFactor={0.3}
          strideMove
        />
      </ThirdPersonCamera>


      {/* 准星 */}
      <Reticle />

      {/* 虚拟摇杆 */}
      <Joystick
        onMove={(e) => {
          const dummy = dummyRef.current;
          if (!dummy) return;

          dummy.strideForward = -e.y * 5;
          dummy.strideRight = -e.x * 5;
        }}
        onMoveEnd={() => {
          const dummy = dummyRef.current;
          if (!dummy) return;

          dummy.strideForward = 0;
          dummy.strideRight = 0;
        }}
      />
    </World>
  );
};

// loading screen
// 加载界面
const App = () => {
  const progress = usePreload(
    ["env.hdr", "gallery.glb", "pattern.jpeg"],
    "32.7mb"
  );

  if (progress < 100)
    return (
      <div className="w-full h-full absolute bg-black left-0 top-0 flex justify-center items-center text-white">
        loading {Math.floor(progress)}%
      </div>
    );

  return <Game />;
};

export default App;
