const state = {
  stories: ["you", "nova", "rex", "lia", "zed", "kai", "mira"],
  posts: [
    { author: "@nova", location: "Neo Tokyo", caption: "Night rides under hologram skies. #future", likes: 1204, time: "5 MINUTES AGO", saved: false, shares: 3, media: "" , comments:["@rex: this is insane 🔥"]},
    { author: "@lia", location: "Mars Habitat 4", caption: "Sunrise looked unreal today 🚀", likes: 783, time: "22 MINUTES AGO", saved: false, shares: 1, media: "", comments:["@you: wow"] }
  ],
  chats: [
    { user: "rex", text: "your reel is trending ✨" },
    { user: "nova", text: "drop more neon edits" },
    { user: "you", text: "posting one now" }
  ],
  totalSaved: 0
};

const storiesEl = document.getElementById("stories");
const storyTemplate = document.getElementById("storyTemplate");
const postFeed = document.getElementById("postFeed");
const postTemplate = document.getElementById("postTemplate");
const chatList = document.getElementById("chatList");
const chatTemplate = document.getElementById("chatTemplate");
const typingStatus = document.getElementById("typingStatus");

function formatLikes(value) {
  return `${value.toLocaleString()} likes`;
}

function updateStats() {
  document.getElementById("postsCount").textContent = String(state.posts.length);
  document.getElementById("likesCount").textContent = String(state.posts.reduce((sum, p) => sum + p.likes, 0));
  document.getElementById("savedCount").textContent = String(state.totalSaved);
}

function renderStory(name) {
  const node = storyTemplate.content.firstElementChild.cloneNode(true);
  node.querySelector("p").textContent = name;
  const ringBtn = node.querySelector(".story-ring");
  ringBtn.addEventListener("click", () => ringBtn.classList.add("seen"));
  storiesEl.append(node);
}

function renderComments(container, comments) {
  container.innerHTML = "";
  comments.slice(-3).forEach((comment) => {
    const line = document.createElement("p");
    line.textContent = comment;
    container.append(line);
  });
}

function renderPost(post, prepend = false) {
  const card = postTemplate.content.firstElementChild.cloneNode(true);
  card.querySelector("h4").textContent = post.author;
  card.querySelector("small").textContent = post.location || "Unknown";
  card.querySelector(".post-caption").textContent = post.caption;
  card.querySelector(".post-time").textContent = `${post.time} • ${post.shares} shares`;

  const media = card.querySelector(".post-media");
  if (post.media) {
    media.style.backgroundImage = `url('${post.media}')`;
  }

  const likesNode = card.querySelector(".likes");
  const likeBtn = card.querySelector(".like-btn");
  const saveBtn = card.querySelector(".save-btn");
  const shareBtn = card.querySelector(".share-btn");
  const commentsBox = card.querySelector(".comments");
  const commentForm = card.querySelector(".comment-form");
  const commentInput = card.querySelector(".comment-input");
  const commentFocusBtn = card.querySelector(".comment-focus-btn");

  let likes = post.likes;
  let liked = false;
  let saved = post.saved;
  let shares = post.shares;
  const comments = [...post.comments];

  likesNode.textContent = formatLikes(likes);
  renderComments(commentsBox, comments);

  likeBtn.addEventListener("click", () => {
    liked = !liked;
    likes += liked ? 1 : -1;
    likeBtn.textContent = liked ? "♥" : "♡";
    likesNode.textContent = formatLikes(likes);
  });

  saveBtn.addEventListener("click", () => {
    saved = !saved;
    saveBtn.textContent = saved ? "📌" : "🔖";
    state.totalSaved += saved ? 1 : -1;
    updateStats();
  });

  shareBtn.addEventListener("click", () => {
    shares += 1;
    card.querySelector(".post-time").textContent = `${post.time} • ${shares} shares`;
  });

  commentFocusBtn.addEventListener("click", () => commentInput.focus());

  commentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = commentInput.value.trim();
    if (!text) return;
    comments.push(`@you: ${text}`);
    renderComments(commentsBox, comments);
    commentInput.value = "";
  });

  prepend ? postFeed.prepend(card) : postFeed.append(card);
}

function renderChat(message) {
  const item = chatTemplate.content.firstElementChild.cloneNode(true);
  item.querySelector("strong").textContent = message.user;
  item.querySelector("p").textContent = message.text;
  chatList.append(item);
  chatList.scrollTop = chatList.scrollHeight;
}

storiesEl.innerHTML = "";
state.stories.forEach(renderStory);
state.posts.forEach((post) => renderPost(post));
state.chats.forEach(renderChat);
updateStats();

document.getElementById("addStoryBtn").addEventListener("click", () => {
  state.stories.unshift("new-story");
  storiesEl.innerHTML = "";
  state.stories.forEach(renderStory);
});

document.getElementById("mobileNotifBtn")?.addEventListener("click", () => {
  alert("No new notifications yet ✨");
});

document.getElementById("followBtn")?.addEventListener("click", (event) => {
  const btn = event.currentTarget;
  btn.textContent = btn.textContent === "Follow" ? "Following" : "Follow";
});

document.getElementById("postForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const titleInput = document.getElementById("postTitle");
  const locationInput = document.getElementById("postLocation");
  const mediaInput = document.getElementById("postMedia");
  const captionInput = document.getElementById("postCaption");

  const author = titleInput.value.trim();
  const caption = captionInput.value.trim();
  if (!author || !caption) return;

  const newPost = {
    author: `@${author.toLowerCase().replace(/\s+/g, "")}`,
    location: locationInput.value.trim() || "Uploaded now",
    caption,
    likes: 0,
    time: "JUST NOW",
    saved: false,
    shares: 0,
    media: mediaInput.value.trim(),
    comments: []
  };

  state.posts.unshift(newPost);
  renderPost(newPost, true);
  updateStats();

  titleInput.value = "";
  locationInput.value = "";
  mediaInput.value = "";
  captionInput.value = "";
});

document.getElementById("chatForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;

  renderChat({ user: "you", text });
  input.value = "";
  typingStatus.textContent = "typing...";

  setTimeout(() => {
    renderChat({ user: "nova", text: "Got it 👌" });
    typingStatus.textContent = "Online";
  }, 900);
});
