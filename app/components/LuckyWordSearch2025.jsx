"use client";

import { useEffect, useState } from 'react';

const LuckyWordSearch2025 = () => {
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  // หมวดตัวอย่าง (5 หมวด ๆ ละ 15 คำ - ใช้ตัวอักษร A-Z)
  const CATEGORIES = [
    {
      name: 'สถานที่เที่ยว',
      words: ['BEACH','MOUNTAIN','ISLAND','TEMPLE','MUSEUM','PARK','DESERT','FOREST','WATERFALL','CANYON','RIVER','LAKE','CASTLE','GARDEN','CITY']
    },
    {
      name: 'อาหาร',
      words: ['PIZZA','SUSHI','BURGER','PASTA','SALAD','CURRY','STEAK','NOODLES','TACO','RAMEN','DUMPLING','SANDWICH','FRIES','SOUP','BBQ']
    },
    {
      name: 'กีฬา',
      words: ['FOOTBALL','SOCCER','BASKETBALL','TENNIS','GOLF','BASEBALL','VOLLEYBALL','SWIMMING','RUNNING','BOXING','CYCLING','SKIING','SURFING','HOCKEY','CRICKET']
    },
    {
      name: 'สัตว์',
      words: ['LION','TIGER','ELEPHANT','MONKEY','PANDA','ZEBRA','GIRAFFE','DOLPHIN','WHALE','KANGAROO','BEAR','FOX','WOLF','EAGLE','HORSE']
    },
    {
      name: 'เทคโนโลยี',
      words: ['COMPUTER','INTERNET','SMARTPHONE','ROBOTICS','DRONE','CLOUD','SERVER','DATABASE','ALGORITHM','SOFTWARE','HARDWARE','NETWORK','SENSOR','CHIPSET','MACHINE']
    }
  ];

  const [categoryIndex, setCategoryIndex] = useState(0);
  const initialWords = CATEGORIES[0].words.map(w => ({ word: w }));
  const [words, setWords] = useState(initialWords);
  const [startTime, setStartTime] = useState(null);
  const [totalMs, setTotalMs] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [now, setNow] = useState(0);

  // Generate a 15x15 grid
  const generateGrid = (wordsToPlace) => {
    const size = 15;
    const grid = Array(size).fill(null).map(() => Array(size).fill(''));
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Directions: horizontal, vertical, diagonal (4 directions)
    const directions = [
      [0, 1],   // horizontal right
      [1, 0],   // vertical down
      [1, 1],   // diagonal down-right
      [1, -1],  // diagonal down-left
      [0, -1],  // horizontal left
      [-1, 0],  // vertical up
      [-1, -1], // diagonal up-left
      [-1, 1]   // diagonal up-right
    ];
    
    // Place each word
    wordsToPlace.forEach(({ word }) => {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        
        // Check if word can be placed
        let canPlace = true;
        const wordArray = word.split('');
        
        for (let i = 0; i < wordArray.length; i++) {
          const newRow = row + (dir[0] * i);
          const newCol = col + (dir[1] * i);
          
          if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
            canPlace = false;
            break;
          }
          
          if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== wordArray[i]) {
            canPlace = false;
            break;
          }
        }
        
        // Place the word
        if (canPlace) {
          for (let i = 0; i < wordArray.length; i++) {
            const newRow = row + (dir[0] * i);
            const newCol = col + (dir[1] * i);
            grid[newRow][newCol] = wordArray[i];
          }
          placed = true;
        }
        
        attempts++;
      }
    });
    
    // Fill empty cells with random letters
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] === '') {
          grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
    
    return grid;
  };

  const [grid, setGrid] = useState(null);

  // เมื่อเปลี่ยนหมวด ให้รีเซ็ตคำที่พบ/การลาก และสร้างกริดใหม่
  useEffect(() => {
    const newWords = CATEGORIES[categoryIndex].words.map(w => ({ word: w }));
    setWords(newWords);
    setFoundWords([]);
    setSelectedCells([]);
    setGrid(generateGrid(newWords));
    if (categoryIndex === 0 && !startTime) {
      setStartTime(Date.now());
    }
  }, [categoryIndex]);

  // อัปเดตตัวนับเวลาแบบเรียลไทม์หลังเริ่มเกม และหยุดเมื่อจบทุกหมวด
  useEffect(() => {
    if (!startTime || showModal) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [startTime, showModal]);

  const checkWord = (cells) => {
    const word = cells.map(([r, c]) => grid[r][c]).join('');
    const reverseWord = word.split('').reverse().join('');
    
    if (!grid) return false;
    const found = words.find(w => w.word === word || w.word === reverseWord);
    
    if (found && !foundWords.includes(found.word)) {
      const next = [...foundWords, found.word];
      setFoundWords(next);
      // ถ้าพบครบทั้งหมวด
      if (next.length === words.length) {
        if (categoryIndex + 1 < CATEGORIES.length) {
          setCategoryIndex(categoryIndex + 1);
        } else {
          const end = Date.now();
          setTotalMs(startTime ? end - startTime : 0);
          setShowModal(true);
        }
      }
      return true;
    }
    return false;
  };

  const handleCellMouseDown = (row, col) => {
    setIsSelecting(true);
    setSelectedCells([[row, col]]);
  };

  const handleCellMouseEnter = (row, col) => {
    if (isSelecting) {
      const last = selectedCells[selectedCells.length - 1];
      if (!last || last[0] !== row || last[1] !== col) {
        setSelectedCells([...selectedCells, [row, col]]);
      }
    }
  };

  const handleMouseUp = () => {
    if (isSelecting && selectedCells.length > 0) {
      checkWord(selectedCells);
      setSelectedCells([]);
    }
    setIsSelecting(false);
  };

  const isSelected = (row, col) => {
    return selectedCells.some(([r, c]) => r === row && c === col);
  };

  const isInFoundWord = (row, col) => {
    if (!grid) return false;
    return foundWords.some(word => {
      const chars = word.split('');
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
          const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1],
            [0, -1], [-1, 0], [-1, -1], [-1, 1]
          ];
          for (const [dr, dc] of directions) {
            let match = true;
            for (let k = 0; k < chars.length; k++) {
              const nr = i + dr * k;
              const nc = j + dc * k;
              if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length || grid[nr][nc] !== chars[k]) {
                match = false;
                break;
              }
              if (match && nr === row && nc === col && k === chars.length - 1) {
                return true;
              }
            }
            if (match) {
              for (let k = 0; k < chars.length; k++) {
                const nr = i + dr * k;
                const nc = j + dc * k;
                if (nr === row && nc === col) return true;
              }
            }
          }
        }
      }
      return false;
    });
  };

  const shareResult = () => {
    const foundMeanings = foundWords.slice(0, 3).map(w => {
      const wordObj = words.find(x => x.word === w);
      return wordObj?.meaning || '';
    });
    
    const text = `🎮 I found ${foundWords.length}/20 lucky words!\n\n✨ My 2025 Prediction: ${foundMeanings.join(' ')}\n\nWords found: ${foundWords.join(', ')}\n\n🍀 Try the Lucky Word Search 2025!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Lucky Word Search 2025',
        text: text
      });
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('Result copied to clipboard!\n\n' + text);
      });
    }
  };

  const resetGame = () => {
    window.location.reload();
  };

  const progress = (foundWords.length / words.length) * 100;

  const formatMs = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
  };
  const elapsedMs = startTime ? (showModal ? (totalMs || 0) : (now && now > startTime ? now - startTime : 0)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300 p-2 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <div className="inline-block bg-white rounded-3xl px-4 md:px-8 py-4 md:py-6 shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
              <span className="text-3xl md:text-5xl">🍀</span>
              <h1 className="text-2xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">
                Lucky Word Search
              </h1>
              <span className="text-3xl md:text-5xl">✨</span>
            </div>
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl px-4 md:px-6 py-2 md:py-3 transform rotate-1 hover:rotate-0 transition-transform">
              <p className="text-lg md:text-2xl font-bold text-white">
                โหมดเล่นเป็นหมวด: หมวดละ 15 คำ • รวม 5 หมวด
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar + Timer + Stepper */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-3 md:p-4 mb-3 md:mb-4 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
            <span className="text-sm md:text-base font-bold text-gray-700">หมวด {categoryIndex + 1}/{CATEGORIES.length}: {CATEGORIES[categoryIndex].name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xl">⏱️</span>
              <span className="text-lg md:text-xl font-extrabold text-purple-700">{formatMs(elapsedMs)}</span>
            </div>
            <span className="text-sm md:text-base font-bold text-purple-600">{foundWords.length}/{words.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 md:h-4">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 md:h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${progress}%` }}
            >
              {progress > 10 && <span className="text-xs text-white font-bold">{Math.round(progress)}%</span>}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((c, idx) => (
              <div key={c.name} className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-sm md:text-base font-bold 
                ${idx < categoryIndex ? 'bg-green-500 text-white' : idx === categoryIndex ? 'bg-purple-600 text-white animate-pulse' : 'bg-gray-200 text-gray-500'}`}
                title={`${idx + 1}. ${c.name}`}
              >
                {idx < categoryIndex ? '✓' : idx + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-3 md:p-4 mb-3 md:mb-4 shadow-lg">
          <p className="text-center text-gray-700 font-medium text-sm md:text-base">
            🎯 ลากเมาส์ผ่านตัวอักษรเพื่อสะกดคำให้ครบ 15 คำต่อหมวด แล้วไปหมวดถัดไป
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Word Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur rounded-3xl p-3 md:p-6 shadow-2xl">
              <div 
                className="grid gap-0.5 md:gap-1 mx-auto"
                style={{ gridTemplateColumns: `repeat(15, minmax(0, 1fr))` }}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {grid
                  ? grid.map((row, rowIndex) => (
                      row.map((cell, colIndex) => (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`
                            aspect-square flex items-center justify-center 
                            text-xs md:text-base font-bold rounded cursor-pointer
                            transition-all duration-200 select-none
                            ${isSelected(rowIndex, colIndex) 
                              ? 'bg-yellow-400 text-purple-900 scale-110 shadow-lg z-10' 
                              : isInFoundWord(rowIndex, colIndex)
                              ? 'bg-gradient-to-br from-green-300 to-emerald-400 text-green-900'
                              : 'bg-gray-50 text-gray-700 hover:bg-purple-100'
                            }
                          `}
                          onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                          onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                        >
                          {cell}
                        </div>
                      ))
                    ))
                  : Array.from({ length: 15 * 15 }).map((_, i) => (
                      <div
                        key={`skeleton-${i}`}
                        className="aspect-square rounded bg-gray-100 animate-pulse"
                      />
                    ))}
              </div>
            </div>
          </div>

          {/* Word List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur rounded-2xl p-4 md:p-6 shadow-lg sticky top-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
                🎊 คำในหมวดนี้
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {[...words].sort((a, b) => a.word.localeCompare(b.word)).map(({ word }) => (
                  <div
                    key={word}
                    className={`
                      rounded-xl p-3 text-center font-bold transition-all duration-300
                      ${foundWords.includes(word)
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white scale-105 shadow-lg'
                        : 'bg-gray-100 text-gray-400'
                      }
                    `}
                  >
                    <div className="text-sm md:text-base">{word}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 justify-center mt-6">
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-xl md:text-2xl">🔄</span>
            New Game
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 md:mt-8">
          <div className="inline-block bg-white/80 backdrop-blur rounded-2xl px-4 md:px-6 py-3 md:py-4 shadow-lg">
            <p className="text-xs md:text-sm text-gray-600 font-medium">
              ✨ Lucky Word Search 2025 • Find your fortune daily! 🍀
            </p>
          </div>
        </div>
      </div>
      
      {/* Modal แสดงเวลารวมเมื่อเคลียร์ครบทุกหมวด */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-[90%] text-center shadow-2xl">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">ยินดีด้วย!</h3>
            <p className="text-gray-700 mb-4">คุณผ่านครบทุก {CATEGORIES.length} หมวด</p>
            <div className="text-5xl font-extrabold text-purple-600 mb-4">{formatMs(totalMs || 0)}</div>
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              เล่นใหม่อีกครั้ง
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyWordSearch2025;


