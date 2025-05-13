let editIndex = null;

function addNews() {
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const imageInput = document.getElementById("image");

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const imageFile = imageInput.files[0];

  if (!title || !content) {
    alert("Iltimos, sarlavha va matn kiriting!");
    return;
  }

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUrl = e.target.result;
      saveNews(title, content, imageUrl);
    };
    reader.readAsDataURL(imageFile);
  } else {
    saveNews(title, content, null);
  }

  titleInput.value = "";
  contentInput.value = "";
  imageInput.value = "";
}

function saveNews(title, content, imageUrl) {
  const date = new Date().toLocaleString("uz-UZ");
  const news = { title, content, imageUrl, date };

  let newsList = JSON.parse(localStorage.getItem("news")) || [];

  if (editIndex !== null) {
    newsList[editIndex] = news;
    editIndex = null;
  } else {
    newsList.unshift(news);
  }

  localStorage.setItem("news", JSON.stringify(newsList));
  renderNews();
}

function renderNews() {
  const newsListContainer = document.getElementById("news-list");
  newsListContainer.innerHTML = "";
  const newsList = JSON.parse(localStorage.getItem("news")) || [];

  newsList.forEach((item, index) => {
    const newsItem = document.createElement("div");
    newsItem.className = "news-item";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const date = document.createElement("small");
    date.textContent = item.date;

    const content = document.createElement("p");
    content.textContent = item.content;

    newsItem.appendChild(title);
    newsItem.appendChild(date);

    if (item.imageUrl) {
      const img = document.createElement("img");
      img.src = item.imageUrl;
      newsItem.appendChild(img);
    }

    newsItem.appendChild(content);

    const btnContainer = document.createElement("div");
    btnContainer.className = "buttons";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Tahrirlash";
    editBtn.onclick = () => editNews(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "O‘chirish";
    deleteBtn.onclick = () => deleteNews(index);

    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);
    newsItem.appendChild(btnContainer);

    newsListContainer.appendChild(newsItem);
  });
}

function deleteNews(index) {
  if (confirm("Rostdan ham o‘chirmoqchimisiz?")) {
    let newsList = JSON.parse(localStorage.getItem("news")) || [];
    newsList.splice(index, 1);
    localStorage.setItem("news", JSON.stringify(newsList));
    renderNews();
  }
}

function editNews(index) {
  const newsList = JSON.parse(localStorage.getItem("news")) || [];
  const item = newsList[index];

  document.getElementById("title").value = item.title;
  document.getElementById("content").value = item.content;
  document.getElementById("image").value = "";
  editIndex = index;
}

window.onload = renderNews;
