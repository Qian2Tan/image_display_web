// --------------------------
// 依照「螢幕比例 + 照片數量」動態決定 rows / cols
// 目標：讓畫面最接近平衡方形，不浪費空間
// --------------------------
function computeGrid(total) {
  // 取得螢幕寬高比（>1 = 橫向寬螢幕、<1 = 手機直向）
  const screenRatio = window.innerWidth / window.innerHeight;

  // 欄數 = 根據「照片總數 * 螢幕比例」開根號
  // 螢幕越寬 → 欄數越多
  let cols = Math.round(Math.sqrt(total * screenRatio));

  // 列數 = 總數 / 欄數（無條件進位）
  let rows = Math.ceil(total / cols);

  return { cols, rows };
}


// --------------------------
// 產生空白的 tile 格子
// --------------------------
function createGrid(n) {
  const stage = document.getElementById("stage");
  stage.innerHTML = ""; // 清空舊格子

  for (let i = 0; i < n; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.innerHTML = `
      <div class="card">
        <div class="back"></div>
        <div class="front"><img alt=""></div>
      </div>`;
    stage.appendChild(tile);
  }
}


// --------------------------
// 把圖片路徑放進 <img>
// --------------------------
function fillImages(list) {
  const imgs = [...document.querySelectorAll(".front img")];
  imgs.forEach((img, i) => img.src = list[i]); // 依序塞圖片
}


// --------------------------
// 自動縮放整個 grid，避免裁切或捲軸
// 概念：容器剩餘高度 / grid 實際高度 = 縮放比例
// --------------------------
function autoScaleGrid() {
  const stage = document.getElementById("stage");
  const container = document.getElementById("stage-container");

  const gridHeight = stage.scrollHeight;       // grid 高度
  const containerHeight = container.clientHeight; // 可使用高度

  let scale = containerHeight / gridHeight;

  // ✅ 不放大，只縮小（維持像拼圖牆的質感）
  if (scale > 1) scale = 1;

  stage.style.transform = `scale(${scale})`;
  stage.style.transformOrigin = "top center"; // 從上方往下縮最自然
}


// --------------------------
// 初始化流程
// 1) 讀取照片清單
// 2) 計算 cols/rows
// 3) 產生 tile
// 4) 填入圖片
// 5) 縮放 grid
// --------------------------
async function init() {
  let list = [];

  try {
    const res = await fetch("/web_tool/photos.json");
    list = await res.json(); // 後端給的圖片清單
  } catch {
    // ✅ 沒照片或錯誤 → 用臨時圖片
    list = [...Array(12)].map((_, i) => `https://picsum.photos/seed/${i}/800/600`);
  }

  const { cols, rows } = computeGrid(list.length);

  // 把計算結果寫入 CSS 變數
  document.documentElement.style.setProperty('--cols', cols);
  document.documentElement.style.setProperty('--rows', rows);

  createGrid(list.length);
  fillImages(list);

  // ✅ 網格產生後再縮放，避免抓不到高度
  requestAnimationFrame(autoScaleGrid);
}


// --------------------------
// 第一次載入
// --------------------------
init();


// --------------------------
// 視窗尺寸變化 → 重新排版 + 自動縮放
// 避免 resize 連續觸發抖動
// --------------------------
window.addEventListener("resize", () => {
  clearTimeout(window._resizeTimer);
  window._resizeTimer = setTimeout(init, 150);
});



// ------------------------
// Zoom Lightbox 點擊放大
// ------------------------
const zoomViewer = document.getElementById("zoom-viewer");
const zoomImg = zoomViewer.querySelector("img");

stage.addEventListener("click", e => {
  const img = e.target.closest(".front img");
  if (!img) return;
  zoomImg.src = img.src;
  zoomViewer.style.display = "flex";
});

zoomViewer.addEventListener("click", () => {
  zoomViewer.style.display = "none";
});
