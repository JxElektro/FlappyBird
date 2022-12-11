// This will be a Flappy Bird clone
import './App.css';
import styled from 'styled-components';
import { useState, useEffect } from 'react';

const Bird_Size = 20;
const Game_Width = 500;
const Game_Height = 500;
const Gravity = 6;
const Jump_Height = 100;
const Obstacle_Width = 40;
const Obstacle_gap = 200;

function App() {
  const [birdPosition, setBirdPosition] = useState(250);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(100);
  const [obstacleLeft, setObstacleLeft] = useState(Game_Width - Obstacle_Width);
  const [score, setScore] = useState(0);

  const bottomObstacleHeight = Game_Height - Obstacle_gap - obstacleHeight;


  useEffect(() => {
    let timeId;
    if (gameHasStarted && birdPosition < Game_Height - Bird_Size) {
      timeId = setInterval(() => {
        setBirdPosition((birdPosition) => birdPosition + Gravity);
      }, 24);
    } return () => {clearInterval(timeId);};}, [gameHasStarted, birdPosition]);

  useEffect(() => {
    let obstacleId;
    if (gameHasStarted && obstacleLeft >= -Obstacle_Width) {
      obstacleId = setInterval(() => {
        setObstacleLeft((obstacleLeft) => obstacleLeft - 5);
      }, 24);
      return () => {clearInterval(obstacleId);};
    } else {
      setObstacleLeft(Game_Width - Obstacle_Width);
      setObstacleHeight(Math.floor(Math.random() * ( Game_Height - Obstacle_gap))
      );
      setScore((score) => score + 1);
    }
  });
  
  

const handleClick = () => {
  let newBirdPosition = birdPosition - Jump_Height;
  if (!gameHasStarted) {
    setGameHasStarted(true);
  }
  else if (newBirdPosition < 0) {
    setBirdPosition(0);
  }
  setBirdPosition(newBirdPosition);
};

return (
  <Div onClick={handleClick}>
    <GameBox height={Game_Height} width={Game_Width} >
      <Obstacle
        top="0"
        width={Obstacle_Width}
        height={obstacleHeight}
        left={obstacleLeft}
      />
      <Obstacle
        top={Game_Height - (obstacleHeight + Obstacle_gap)}
        width={Obstacle_Width}
        height={bottomObstacleHeight}
        left={obstacleLeft}
      />
      <Bird size={Bird_Size} top={birdPosition} />
    </GameBox>
  </Div>
);
}


export default App;

const Bird = styled.div`
  position: absolute;
  background-color: red;
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  top: ${props => props.top}px;
  border-radius: 50%;
`;

const Div = styled.div`
display: flex;
width: 100%;
justify-content: center;
`;

const GameBox = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: skyblue;
  overflow: hidden;
`;

const Obstacle = styled.div`
  position: relative;
  top: ${props => props.top}px;
  background-color: Green;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
`;

