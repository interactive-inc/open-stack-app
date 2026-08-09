import { createFileRoute } from "@tanstack/react-router"
import { useCallback, useRef, useState } from "react"
import { CanvasView } from "@/components/canvas-view"
import { Card } from "@/components/ui/card"
import { useKeyboard } from "@/hooks/use-keyboard"

export const Route = createFileRoute("/canvas")({
  component: RouteComponent,
})

type Point = {
  x: number
  y: number
}

type GameState = {
  snake: Point[]
  food: Point
  direction: Point
  gameOver: boolean
  score: number
  gridSize: number
  cellSize: number
  lastUpdateTime: number
}

function RouteComponent() {
  const stateRef = useRef<GameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: { x: 1, y: 0 },
    gameOver: false,
    score: 0,
    gridSize: 30,
    cellSize: 15,
    lastUpdateTime: 0,
  })

  const [_displayState, setDisplayState] = useState({
    score: 0,
    gameOver: false,
    lastKey: "None",
  })

  const generateFood = useCallback(() => {
    const state = stateRef.current
    let newFood: Point
    do {
      newFood = {
        x: Math.floor(Math.random() * state.gridSize),
        y: Math.floor(Math.random() * state.gridSize),
      }
    } while (state.snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  const resetGame = useCallback(() => {
    stateRef.current = {
      snake: [{ x: 10, y: 10 }],
      food: generateFood(),
      direction: { x: 1, y: 0 },
      gameOver: false,
      score: 0,
      gridSize: 30,
      cellSize: 15,
      lastUpdateTime: 0,
    }
    setDisplayState({
      score: 0,
      gameOver: false,
      lastKey: "None",
    })
  }, [generateFood])

  useKeyboard((key) => {
    const state = stateRef.current

    if (key === "r" || key === "R") {
      resetGame()
      setDisplayState((prev) => ({ ...prev, lastKey: "R (Reset)" }))
      return
    }

    if (state.gameOver) return

    if (key === "ArrowUp" && state.direction.y === 0) {
      state.direction = { x: 0, y: -1 }
      setDisplayState((prev) => ({ ...prev, lastKey: "↑" }))
    }
    if (key === "ArrowDown" && state.direction.y === 0) {
      state.direction = { x: 0, y: 1 }
      setDisplayState((prev) => ({ ...prev, lastKey: "↓" }))
    }
    if (key === "ArrowLeft" && state.direction.x === 0) {
      state.direction = { x: -1, y: 0 }
      setDisplayState((prev) => ({ ...prev, lastKey: "←" }))
    }
    if (key === "ArrowRight" && state.direction.x === 0) {
      state.direction = { x: 1, y: 0 }
      setDisplayState((prev) => ({ ...prev, lastKey: "→" }))
    }
  }, true)

  const onDraw = useCallback(
    (context: CanvasRenderingContext2D, time: DOMHighResTimeStamp) => {
      const canvas = context.canvas
      const state = stateRef.current

      // Update game logic (60 FPS / 6 = 10 updates per second)
      if (time - state.lastUpdateTime > 100 && !state.gameOver) {
        state.lastUpdateTime = time

        // Move snake
        const head = { ...state.snake[0] }
        head.x += state.direction.x
        head.y += state.direction.y

        // Check wall collision
        if (head.x < 0 || head.x >= state.gridSize || head.y < 0 || head.y >= state.gridSize) {
          state.gameOver = true
          setDisplayState((prev) => ({ ...prev, gameOver: true }))
          return
        }

        // Check self collision
        if (state.snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          state.gameOver = true
          setDisplayState((prev) => ({ ...prev, gameOver: true }))
          return
        }

        state.snake.unshift(head)

        // Check food collision
        if (head.x === state.food.x && head.y === state.food.y) {
          state.score += 10
          state.food = generateFood()
          setDisplayState((prev) => ({ ...prev, score: state.score }))
        } else {
          state.snake.pop()
        }
      }

      // Clear canvas
      context.fillStyle = "#111"
      context.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      const offsetX = (canvas.width - state.gridSize * state.cellSize) / 2
      const offsetY = (canvas.height - state.gridSize * state.cellSize) / 2

      context.strokeStyle = "#222"
      context.lineWidth = 1
      for (let i = 0; i <= state.gridSize; i++) {
        context.beginPath()
        context.moveTo(offsetX + i * state.cellSize, offsetY)
        context.lineTo(offsetX + i * state.cellSize, offsetY + state.gridSize * state.cellSize)
        context.stroke()

        context.beginPath()
        context.moveTo(offsetX, offsetY + i * state.cellSize)
        context.lineTo(offsetX + state.gridSize * state.cellSize, offsetY + i * state.cellSize)
        context.stroke()
      }

      // Draw snake
      state.snake.forEach((segment, index) => {
        context.fillStyle = index === 0 ? "#0f0" : "#090"
        context.fillRect(
          offsetX + segment.x * state.cellSize + 1,
          offsetY + segment.y * state.cellSize + 1,
          state.cellSize - 2,
          state.cellSize - 2,
        )
      })

      // Draw food
      context.fillStyle = "#f00"
      context.beginPath()
      context.arc(
        offsetX + state.food.x * state.cellSize + state.cellSize / 2,
        offsetY + state.food.y * state.cellSize + state.cellSize / 2,
        state.cellSize / 3,
        0,
        Math.PI * 2,
      )
      context.fill()

      // Draw game over
      if (state.gameOver) {
        context.fillStyle = "rgba(0, 0, 0, 0.7)"
        context.fillRect(0, 0, canvas.width, canvas.height)

        context.fillStyle = "#fff"
        context.font = "bold 48px monospace"
        context.textAlign = "center"
        context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20)

        context.font = "24px monospace"
        context.fillText(`Score: ${state.score}`, canvas.width / 2, canvas.height / 2 + 20)

        context.font = "16px monospace"
        context.fillText("Press R to restart", canvas.width / 2, canvas.height / 2 + 60)
      }
    },
    [generateFood],
  )

  return (
    <div>
      <Card className="fixed bottom-4 left-4 rounded p-0 opacity-25">
        <div className="w-40 p-2">
          <div>Score: {_displayState.score}</div>
          <div>Last Key: {_displayState.lastKey}</div>
        </div>
      </Card>
      <CanvasView onDraw={onDraw} />
    </div>
  )
}
