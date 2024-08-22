import React, { useState, useEffect, useRef } from "react";

const Game = () => {
  const [numElements, setNumElements] = useState("");  // Số phần tử người dùng nhập
  const [numbers, setNumbers] = useState([]);  // Các số hiển thị
  const [clickedNumbers, setClickedNumbers] = useState([]);  // Các số người dùng đã click
  const [isGameOver, setIsGameOver] = useState(false);  // Trạng thái game over
  const [timer, setTimer] = useState(0);  // Bộ đếm thời gian
  const intervalRef = useRef(null);  // Ref để lưu trữ ID của interval

  // Khởi động bộ đếm thời gian
  const resetTimer = () => {
    setTimer(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setTimer((prevTime) => prevTime + 0.01);
    }, 10);
  };

  // Dừng bộ đếm thời gian
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Khởi tạo game khi nhấn nút bắt đầu
  const startGame = () => {
    const count = parseInt(numElements);
    if (count < 1 || count > 100 || isNaN(count)) {
      alert("Vui lòng nhập số phần tử hợp lệ (1-100).");
      return;
    }

    const orderedNumbers = Array.from({ length: count }, (_, i) => i + 1);

    setNumbers(orderedNumbers);  // Không cần xáo trộn
    setClickedNumbers([]);
    setIsGameOver(false);
    resetTimer();  // Reset bộ đếm thời gian
  };

  // Xử lý khi người dùng click vào số
  const handleNumberClick = (num) => {
    if (isGameOver) return;

    const nextCorrectNumber = numbers[clickedNumbers.length];

    if (num === nextCorrectNumber) {
      setClickedNumbers([...clickedNumbers, num]);

      // Kiểm tra nếu người dùng click đúng hết thứ tự
      if (clickedNumbers.length + 1 === numbers.length) {
        stopTimer();  // Dừng bộ đếm thời gian
        alert(`Chúc mừng! Bạn đã hoàn thành trong ${timer.toFixed(2)} giây.`);
      }
    } else {
      setIsGameOver(true);
      stopTimer();
    }
  };

  // Khởi động lại game
  const restartGame = () => {
    setNumbers([]);
    setClickedNumbers([]);
    setIsGameOver(false);
    setNumElements("");
    stopTimer();
    setTimer(0);
  };

  // Dọn dẹp interval khi component unmount
  useEffect(() => {
    return () => stopTimer();
  }, []);

  // Tạo vị trí ngẫu nhiên cho các số
  const getRandomPosition = () => {
    const maxWidth = 300;  // Width của div
    const maxHeight = 300; // Height của div
    const x = Math.random() * (maxWidth - 50);  // Tránh tràn ra ngoài (width - kích thước số)
    const y = Math.random() * (maxHeight - 50); // Tránh tràn ra ngoài (height - kích thước số)
    return { x, y };
  };

  return (
    <div style={styles.container}>
      <h1>Clear The Points Game</h1>
      {!numbers.length && (
        <>
          <input
            type="number"
            value={numElements}
            onChange={(e) => setNumElements(e.target.value)}
            placeholder="Nhập số phần tử (1-100)"
            style={styles.input}
          />
          <button onClick={startGame} style={styles.button}>Bắt đầu game</button>
        </>
      )}

      {numbers.length > 0 && (
        <>
          <div style={styles.gameArea}>
            {numbers.map((num, index) => {
              const { x, y } = getRandomPosition();  // Lấy vị trí ngẫu nhiên cho mỗi số
              return (
                <button
                  key={index}
                  onClick={() => handleNumberClick(num)}
                  style={{
                    ...styles.numberButton,
                    top: `${y}px`,
                    left: `${x}px`,
                    backgroundColor: clickedNumbers.includes(num) ? "#ddd" : "#f0f0f0",
                    cursor: isGameOver || clickedNumbers.includes(num) ? "not-allowed" : "pointer",
                  }}
                  disabled={clickedNumbers.includes(num) || isGameOver}
                >
                  {num}
                </button>
              );
            })}
          </div>
          <p>Thời gian: {timer.toFixed(2)} giây</p>
          {isGameOver && <p>Game Over! Bạn đã chọn sai số.</p>}
          <button onClick={restartGame} style={styles.button}>Chơi lại</button>
        </>
      )}
    </div>
  );
};

// Styles được tối ưu hóa
const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    width: "200px",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
  gameArea: {
    position: "relative",
    width: "300px",  // Kích thước cố định cho thẻ div chứa số
    height: "300px",
    border: "2px solid #000",
    margin: "20px auto",
    backgroundColor: "#f7f7f7",
    overflow: "hidden",  // Ngăn số tràn ra ngoài
  },
  numberButton: {
    position: "absolute",  // Các số được đặt ở vị trí tuyệt đối
    width: "50px",
    height: "50px",
    fontSize: "20px",
    borderRadius: "50%",
    border: "1px solid #ccc",
    textAlign: "center",
    lineHeight: "50px",  // Canh giữa số
  },
};

export default Game;
