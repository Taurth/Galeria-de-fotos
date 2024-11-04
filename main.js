document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    let currentPage = 1;
    const itemsPerPage = 6;
    let allData = [];

    function fetchData() {
        return fetch('data.json') // Puedes cambiar esto por una API externa
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar los datos');
                }
                return response.json();
            })
            .catch(error => console.error('Fetch error:', error));
    }

    function renderGallery(data, append = false) {
        if (!append) gallery.innerHTML = '';

        const paginatedData = data.slice(0, currentPage * itemsPerPage);
        paginatedData.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('image-card');
            card.innerHTML = `
                <img src="${item.url}" alt="${item.title}">
                <h3>${item.title}</h3>
            `;
            card.addEventListener('click', () => openModal(item));
            gallery.appendChild(card);
        });

        if (data.length > paginatedData.length) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    function openModal(item) {
        Swal.fire({
            title: item.title,
            imageUrl: item.url,
            imageWidth: 600,
            imageAlt: item.title,
            showCloseButton: true,
            showConfirmButton: false
        });
    }

    function filterData() {
        const searchText = searchInput.value.toLowerCase();
        const filterCategory = filterSelect.value;

        return allData.filter(item =>
            item.title.toLowerCase().includes(searchText) &&
            (filterCategory === 'all' || item.category === filterCategory)
        );
    }

    searchInput.addEventListener('input', () => {
        const filteredData = filterData();
        currentPage = 1;
        renderGallery(filteredData);
    });

    filterSelect.addEventListener('change', () => {
        const filteredData = filterData();
        currentPage = 1;
        renderGallery(filteredData);
    });

    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderGallery(filterData(), true);
    });

    fetchData().then(data => {
        allData = _.orderBy(data, ['title'], ['asc']); // Uso de lodash para ordenar alfabéticamente
        renderGallery(allData);
    });
});