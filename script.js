document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postsContainer = document.getElementById('postsContainer');
    const filterCategory = document.getElementById('filterCategory');

    postForm.addEventListener('submit', createPost);
    filterCategory.addEventListener('change', filterPosts);

    let posts = [];

    function createPost(event) {
        event.preventDefault();

        const postText = document.getElementById('postText').value;
        const postCategory = document.getElementById('postCategory').value;
        const imageUrl1 = document.getElementById('imageUrl1').value;
        const imageUrl2 = document.getElementById('imageUrl2').value;
        const imageUrl3 = document.getElementById('imageUrl3').value;
        const date = new Date().toLocaleString();

        const newPost = {
            id: Date.now(),
            text: postText,
            category: postCategory,
            images: [imageUrl1, imageUrl2, imageUrl3].filter(url => url),
            date: date
        };

        posts.push(newPost);
        displayPosts();
        postForm.reset();
    }

    function displayPosts() {
        postsContainer.innerHTML = '';
        const filteredPosts = filterCategory.value === 'Todos' ? posts : posts.filter(post => post.category === filterCategory.value);
        filteredPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <p>${post.text}</p>
                <div class="carousel">
                    ${post.images.map(image => `<img src="${image}" alt="Imagem do post">`).join('')}
                </div>
                ${post.images.length > 1 ? `
                <div class="carousel-buttons">
                    <button class="prev">❮</button>
                    <button class="next">❯</button>
                </div>
                ` : ''}
                <p>Categoria: ${post.category}</p>
                <p>Data e Hora: ${post.date}</p>
                <div class="post-actions">
                    <button class="edit">Editar</button>
                    <button class="delete">Apagar</button>
                </div>
            `;
            postsContainer.appendChild(postElement);

            if (post.images.length > 1) {
                const carousel = postElement.querySelector('.carousel');
                let index = 0;
                const images = carousel.querySelectorAll('img');

                const prevButton = postElement.querySelector('.prev');
                const nextButton = postElement.querySelector('.next');

                prevButton.addEventListener('click', () => {
                    index = (index > 0) ? index - 1 : images.length - 1;
                    updateCarousel();
                });

                nextButton.addEventListener('click', () => {
                    index = (index < images.length - 1) ? index + 1 : 0;
                    updateCarousel();
                });

                function updateCarousel() {
                    const offset = -index * 100;
                    images.forEach(image => {
                        image.style.transform = `translateX(${offset}%)`;
                    });
                }
            }

            const editButton = postElement.querySelector('.edit');
            editButton.addEventListener('click', () => editPost(post.id));

            const deleteButton = postElement.querySelector('.delete');
            deleteButton.addEventListener('click', () => deletePost(post.id));
        });
    }

    function editPost(postId) {
        const post = posts.find(p => p.id === postId);
        if (post) {
            const newText = prompt('Edite seu post:', post.text);
            if (newText !== null) {
                post.text = newText;
                displayPosts();
            }
        }
    }

    function deletePost(postId) {
        if (confirm('Tem certeza que deseja apagar este post?')) {
            posts = posts.filter(p => p.id !== postId);
            displayPosts();
        }
    }

    function filterPosts() {
        displayPosts();
    }
});
