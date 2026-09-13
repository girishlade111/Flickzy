/**
 * Flickzy — Movie & Trailer Discovery Application Logic
 * Author: Girish Lade
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Data Store ---
    const movies = [
        {
            id: 1,
            title: "Dune: Part Two",
            year: 2024,
            duration: "2h 46m",
            rating: 8.6,
            genre: "Sci-Fi",
            cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem",
            overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future.",
            poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
            backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
            trailerEmbed: "https://www.youtube.com/embed/Way9Dexny3w?autoplay=1"
        },
        {
            id: 2,
            title: "Oppenheimer",
            year: 2023,
            duration: "3h 00m",
            rating: 8.9,
            genre: "Drama",
            cast: "Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr.",
            overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
            poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop",
            backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
            trailerEmbed: "https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1"
        },
        {
            id: 3,
            title: "Spider-Man: Across the Spider-Verse",
            year: 2023,
            duration: "2h 20m",
            rating: 8.7,
            genre: "Animation",
            cast: "Shameik Moore, Hailee Steinfeld, Oscar Isaac, Jake Johnson",
            overview: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
            poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop",
            backdrop: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1600&auto=format&fit=crop",
            trailerEmbed: "https://www.youtube.com/embed/cqGjhVJWtEg?autoplay=1"
        },
        {
            id: 4,
            title: "The Dark Knight",
            year: 2008,
            duration: "2h 32m",
            rating: 9.0,
            genre: "Action",
            cast: "Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine",
            overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests of his ability to fight injustice.",
            poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
            backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop",
            trailerEmbed: "https://www.youtube.com/embed/EXeTwQWrcwY?autoplay=1"
        },
        {
            id: 5,
            title: "Interstellar",
            year: 2014,
            duration: "2h 49m",
            rating: 8.7,
            genre: "Sci-Fi",
            cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine",
            overview: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
            poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
            backdrop: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1600&auto=format&fit=crop",
            trailerEmbed: "https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1"
        },
        {
            id: 6,
            title: "Inception",
            year: 2010,
            duration: "2h 28m",
            rating: 8.8,
            genre: "Sci-Fi",
            cast: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy",
            overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
            poster: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=800&auto=format&fit=crop",
            backdrop: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1600&auto=format&fit=crop",
            trailerEmbed: "https://www.youtube.com/embed/YoHD9XEInc0?autoplay=1"
        },
        {
            id: 7,
            title: "Cyberpunk: Edgerunners",
            year: 2022,
            duration: "1h 50m",
            rating: 8.3,
            genre: "Animation",
            cast: "KENN, Aoi Yuki, Hiroki Touchi, Michiko Kaiden",
            overview: "A street kid trying to survive in a technology and body modification-obsessed city of the future. Having everything to lose, he chooses to stay alive by becoming an edgerunner.",
            poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop",
            backdrop: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop",
            trailerEmbed: "https://www.youtube.com/embed/JtqIas3bYhg?autoplay=1"
        },
        {
            id: 8,
            title: "The Batman",
            year: 2022,
            duration: "2h 56m",
            rating: 7.8,
            genre: "Action",
            cast: "Robert Pattinson, Zoë Kravitz, Paul Dano, Colin Farrell",
            overview: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
            poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
            backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
            trailerEmbed: "https://www.youtube.com/embed/mqqft2x_Aa4?autoplay=1"
        },
        {
            id: 9,
            title: "Knives Out",
            year: 2019,
            duration: "2h 10m",
            rating: 7.9,
            genre: "Comedy",
            cast: "Daniel Craig, Chris Evans, Ana de Armas, Jamie Lee Curtis",
            overview: "A detective investigates the death of a patriarch of an eccentric, combative family in this clever whodunit mystery.",
            poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
            backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
            trailerEmbed: "https://www.youtube.com/embed/qGqiHJTsRkU?autoplay=1"
        },
        {
            id: 10,
            title: "Se7en",
            year: 1995,
            duration: "2h 07m",
            rating: 8.6,
            genre: "Thriller",
            cast: "Morgan Freeman, Brad Pitt, Kevin Spacey, Gwyneth Paltrow",
            overview: "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.",
            poster: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=800&auto=format&fit=crop",
            backdrop: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1600&auto=format&fit=crop",
            trailerEmbed: "https://www.youtube.com/embed/znmZoVkCjpI?autoplay=1"
        }
    ];

    // --- State ---
    let activeGenre = 'All';
    let searchQuery = '';
    let sortBy = 'popular';
    let watchlist = JSON.parse(localStorage.getItem('flickzy_watchlist') || '[]');

    // --- DOM Elements ---
    const movieGrid = document.getElementById('movieGrid');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const genreFilters = document.getElementById('genreFilters');
    const sortSelect = document.getElementById('sortSelect');
    const resultsCount = document.getElementById('resultsCount');
    const catalogHeading = document.getElementById('catalogHeading');
    const emptyState = document.getElementById('emptyState');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    
    // Watchlist Elements
    const watchlistToggleBtn = document.getElementById('watchlistToggleBtn');
    const watchlistDrawer = document.getElementById('watchlistDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const watchlistContent = document.getElementById('watchlistContent');
    const watchlistBadge = document.getElementById('watchlistBadge');
    const clearWatchlistBtn = document.getElementById('clearWatchlistBtn');

    // Hero & Modal Elements
    const heroBackdrop = document.getElementById('heroBackdrop');
    const heroTitle = document.getElementById('heroTitle');
    const heroRating = document.getElementById('heroRating');
    const heroYear = document.getElementById('heroYear');
    const heroDuration = document.getElementById('heroDuration');
    const heroGenre = document.getElementById('heroGenre');
    const heroOverview = document.getElementById('heroOverview');
    const heroPlayBtn = document.getElementById('heroPlayBtn');
    const heroWatchlistBtn = document.getElementById('heroWatchlistBtn');

    const movieModal = document.getElementById('movieModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalIframe = document.getElementById('modalIframe');
    const modalTitle = document.getElementById('modalTitle');
    const modalRating = document.getElementById('modalRating');
    const modalYear = document.getElementById('modalYear');
    const modalDuration = document.getElementById('modalDuration');
    const modalGenre = document.getElementById('modalGenre');
    const modalOverview = document.getElementById('modalOverview');
    const modalCast = document.getElementById('modalCast');
    const modalWatchlistBtn = document.getElementById('modalWatchlistBtn');

    let currentModalMovieId = null;

    // --- Initialization ---
    initHero();
    renderMovies();
    updateWatchlistUI();

    // --- Hero Spotlight Initialization ---
    function initHero() {
        const featured = movies[0];
        heroBackdrop.style.backgroundImage = `url('${featured.backdrop}')`;
        heroTitle.textContent = featured.title;
        heroRating.textContent = featured.rating;
        heroYear.textContent = featured.year;
        heroDuration.textContent = featured.duration;
        heroGenre.textContent = featured.genre;
        heroOverview.textContent = featured.overview;

        heroPlayBtn.onclick = () => openModal(featured.id);
        heroWatchlistBtn.onclick = () => toggleWatchlist(featured.id);
    }

    // --- Filtering & Sorting Logic ---
    function getFilteredMovies() {
        return movies.filter(movie => {
            const matchesGenre = activeGenre === 'All' || movie.genre.toLowerCase() === activeGenre.toLowerCase();
            const matchesSearch = searchQuery === '' || 
                movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                movie.cast.toLowerCase().includes(searchQuery.toLowerCase()) ||
                movie.genre.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesGenre && matchesSearch;
        }).sort((a, b) => {
            if (sortBy === 'popular') return b.rating - a.rating;
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'year') return b.year - a.year;
            if (sortBy === 'title') return a.title.localeCompare(b.title);
            return 0;
        });
    }

    // --- Render Movie Grid ---
    function renderMovies() {
        const filtered = getFilteredMovies();
        movieGrid.innerHTML = '';

        resultsCount.textContent = `Showing ${filtered.length} movie${filtered.length !== 1 ? 's' : ''}`;

        if (filtered.length === 0) {
            emptyState.classList.remove('hidden');
            movieGrid.classList.add('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        movieGrid.classList.remove('hidden');

        filtered.forEach(movie => {
            const isSaved = watchlist.includes(movie.id);
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `
                <div class="poster-wrapper">
                    <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" loading="lazy">
                    <button class="card-bookmark-btn ${isSaved ? 'saved' : ''}" title="${isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}" data-id="${movie.id}">
                        <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark"></i>
                    </button>
                    <div class="card-overlay">
                        <button class="play-icon-btn" title="Watch Trailer" data-id="${movie.id}">
                            <i class="fa-solid fa-play"></i>
                        </button>
                    </div>
                </div>
                <div class="card-info">
                    <div class="card-meta-top">
                        <span class="card-genre">${movie.genre}</span>
                        <span class="card-rating"><i class="fa-solid fa-star"></i> ${movie.rating}</span>
                    </div>
                    <h3 class="card-title" title="${movie.title}">${movie.title}</h3>
                    <span class="card-year">${movie.year} &bull; ${movie.duration}</span>
                </div>
            `;

            // Event Listeners for Card
            card.querySelector('.card-overlay').addEventListener('click', () => openModal(movie.id));
            card.querySelector('.card-bookmark-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleWatchlist(movie.id);
            });

            movieGrid.appendChild(card);
        });
    }

    // --- Watchlist Functions ---
    function toggleWatchlist(movieId) {
        const index = watchlist.indexOf(movieId);
        const movie = movies.find(m => m.id === movieId);

        if (index > -1) {
            watchlist.splice(index, 1);
            showToast(`Removed "${movie.title}" from Watchlist`);
        } else {
            watchlist.push(movieId);
            showToast(`Added "${movie.title}" to Watchlist`);
        }

        localStorage.setItem('flickzy_watchlist', JSON.stringify(watchlist));
        renderMovies();
        updateWatchlistUI();

        if (currentModalMovieId === movieId) {
            updateModalWatchlistBtn(movieId);
        }
    }

    function updateWatchlistUI() {
        watchlistBadge.textContent = watchlist.length;

        if (watchlist.length === 0) {
            watchlistContent.innerHTML = `
                <div class="empty-state">
                    <i class="fa-regular fa-bookmark empty-icon"></i>
                    <h3>Your Watchlist is Empty</h3>
                    <p>Click the bookmark icon on any movie card to add it to your watchlist.</p>
                </div>
            `;
            return;
        }

        watchlistContent.innerHTML = '';
        watchlist.forEach(id => {
            const movie = movies.find(m => m.id === id);
            if (!movie) return;

            const item = document.createElement('div');
            item.className = 'drawer-item';
            item.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}" class="drawer-item-poster">
                <div class="drawer-item-details">
                    <h4 class="drawer-item-title">${movie.title}</h4>
                    <div class="drawer-item-meta">${movie.year} &bull; <i class="fa-solid fa-star" style="color:#FFB800"></i> ${movie.rating}</div>
                    <button class="drawer-remove-btn" data-id="${movie.id}">
                        <i class="fa-solid fa-trash-can"></i> Remove
                    </button>
                </div>
            `;

            item.querySelector('.drawer-remove-btn').addEventListener('click', () => {
                toggleWatchlist(movie.id);
            });

            watchlistContent.appendChild(item);
        });
    }

    // --- Modal Trailer Player ---
    function openModal(movieId) {
        const movie = movies.find(m => m.id === movieId);
        if (!movie) return;

        currentModalMovieId = movieId;
        modalTitle.textContent = movie.title;
        modalRating.innerHTML = `<i class="fa-solid fa-star"></i> ${movie.rating}`;
        modalYear.textContent = movie.year;
        modalDuration.textContent = movie.duration;
        modalGenre.textContent = movie.genre;
        modalOverview.textContent = movie.overview;
        modalCast.textContent = movie.cast;
        modalIframe.src = movie.trailerEmbed;

        updateModalWatchlistBtn(movieId);

        movieModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        movieModal.classList.remove('open');
        modalIframe.src = '';
        document.body.style.overflow = 'auto';
    }

    function updateModalWatchlistBtn(movieId) {
        const isSaved = watchlist.includes(movieId);
        modalWatchlistBtn.innerHTML = isSaved 
            ? `<i class="fa-solid fa-check"></i> In Watchlist`
            : `<i class="fa-solid fa-plus"></i> Add to Watchlist`;
        
        modalWatchlistBtn.onclick = () => toggleWatchlist(movieId);
    }

    // --- Search & Filter Listeners ---
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        clearSearchBtn.classList.toggle('hidden', searchQuery === '');
        renderMovies();
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.classList.add('hidden');
        renderMovies();
    });

    genreFilters.addEventListener('click', (e) => {
        if (!e.target.classList.contains('filter-btn')) return;
        
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        activeGenre = e.target.dataset.genre;
        catalogHeading.textContent = activeGenre === 'All' ? 'Trending Movies' : `${activeGenre} Movies`;
        renderMovies();
    });

    sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        renderMovies();
    });

    resetFilterBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        activeGenre = 'All';
        sortBy = 'popular';
        sortSelect.value = 'popular';
        clearSearchBtn.classList.add('hidden');
        
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-genre="All"]').classList.add('active');
        catalogHeading.textContent = 'Trending Movies';
        
        renderMovies();
    });

    // --- Watchlist Drawer Handlers ---
    watchlistToggleBtn.addEventListener('click', () => {
        watchlistDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
    });

    closeDrawerBtn.addEventListener('click', () => {
        watchlistDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
    });

    drawerOverlay.addEventListener('click', () => {
        watchlistDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
    });

    clearWatchlistBtn.addEventListener('click', () => {
        if (watchlist.length === 0) return;
        watchlist = [];
        localStorage.setItem('flickzy_watchlist', JSON.stringify(watchlist));
        renderMovies();
        updateWatchlistUI();
        showToast("Watchlist cleared");
    });

    closeModalBtn.addEventListener('click', closeModal);
    movieModal.addEventListener('click', (e) => {
        if (e.target === movieModal) closeModal();
    });

    // --- Toast Notifications ---
    function showToast(message) {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-info toast-icon"></i> ${message}`;
        
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2600);
    }
});
