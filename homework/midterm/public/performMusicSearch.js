const apiKey = 'AIzaSyAyb5i7U7nQeezKM8WPbw6bMf0OMML7vPg';

async function performMusicSearch(searchTerm) {
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(searchTerm)}&type=video&videoCategoryId=10&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from YouTube Music API');
    }

    const data = await response.json();
    const videos = data.items.map(item => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      // 添加其他所需的信息...
    }));

    return videos;
  } catch (error) {
    throw new Error(`Error performing music search: ${error.message}`);
  }
}

export { performMusicSearch };
