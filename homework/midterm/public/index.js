const pages = {
  '#home':`<h1>Music Search Engine</h1>`,
  'login.html':`<h1>登入</h1>`,
  'register.html':`<h1>註冊</h1>`
};

const apiKey = 'AIzaSyAyb5i7U7nQeezKM8WPbw6bMf0OMML7vPg';


function searchMusic() {
  const musicSearchInput = document.getElementById('musicSearch');
  const searchTerm = musicSearchInput.value;

  if (!searchTerm) {
    alert("請輸入搜索詞！");
    return;
  }
  performMusicSearch(searchTerm)
    .then(searchResults => {
      handleSearchResults(searchResults);
    })
    .catch(error => {
      handleOtherError(error);
    });
}

async function performMusicSearch(searchTerm) {
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(searchTerm)}&type=video&videoCategoryId=10&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('從YouTube API獲取數據失敗');
    }

    const data = await response.json();
    const videos = data.items.map(item => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      // 添加其他所需的信息...
    }));

    return videos;
  } catch (error) {
    throw new Error(`執行音樂搜索時出錯: ${error.message}`);
  }
}

function handleSearchResults(results) {
  const searchResultsContainer = document.getElementById('searchResults');
  searchResultsContainer.innerHTML = '';

  if (results.length > 0) {
    // 如果有搜索結果，則遍歷並顯示每個搜索結果
    results.forEach(result => {
      const videoTitle = result.title;
      const videoId = result.videoId;

      const resultItem = document.createElement('div');
      resultItem.innerHTML = `
        <p>${videoTitle}</p>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
      `;
      searchResultsContainer.appendChild(resultItem);
    });

    const firstResult = results[0];
    const firstVideoItem = document.createElement('div');
    firstVideoItem.innerHTML = `
      <p>${firstResult.title}</p>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/${firstResult.videoId}" frameborder="0" allowfullscreen></iframe>
    `;
    videoContainer.appendChild(firstVideoItem);


  } else {
    handleNoResults();
  }
}


function handleNoResults() {
  const searchResultsContainer = document.getElementById('searchResults');
  searchResultsContainer.innerHTML = '<p>未找到相應的視頻。</p>';
}

function handleOtherError(error) {
  console.error('Error performing music search:', error);
}

function showLoadingIndicator() {
  const loadingSpinner = document.getElementById('loadingSpinner');
  loadingSpinner.style.display = 'block';
}

function hideLoadingIndicator() {
  const loadingSpinner = document.getElementById('loadingSpinner');
  loadingSpinner.style.display = 'none';
}

// 監聽搜尋按鈕的點擊事件
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', searchMusic);


