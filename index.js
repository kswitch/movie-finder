const searchOrWatchList = document.querySelector('#search-or-watchlist')
const filmOrWatchList = document.querySelector('#find-film-or-my-watchlist')
const textInput = document.querySelector('.search-text')
const baseURL = `https://www.omdbapi.com/`
const apiKey = `3bc9d79e`
const moviesArray = []

const watchlist = localStorage.getItem('stored_watchlist')
const storedWatchlist =  (watchlist) ? JSON.parse((watchlist)) : []

searchOrWatchList.textContent = `My Watchlist`
filmOrWatchList.textContent = `Find your film`

document.body.addEventListener('keypress', (event) => {
    if (event.code == 'Enter') {
        if (document.activeElement.className == 'search-text') {
            searchForMovie(textInput.value)
            document.querySelector('.search-results').style.display = 'inherit'
            document.querySelector('.more-movie-info').style.display = 'none'
            document.querySelector('.my-watchlist').style.display = 'none'
        }
    }
})

document.body.addEventListener('click', (event) => {
    
    if (event.target.id == "search-or-watchlist") {

        if (filmOrWatchList.textContent == "Find your film") {
            filmOrWatchList.textContent = `My Watchlist`
            searchOrWatchList.textContent = `Back to Movies List`
            renderWatchList(storedWatchlist)
            document.querySelector('.search-results').style.display = 'none'
            document.querySelector('.more-movie-info').style.display = 'none'
            document.querySelector('.search').style.display = 'none'
            document.querySelector('.my-watchlist').style.display = 'inherit'
            }
        else if (filmOrWatchList.textContent == "My Watchlist") {
            filmOrWatchList.textContent = `Find your film`
            searchOrWatchList.textContent = `My Watchlist`
            document.querySelector('.search').style.display = 'inherit'
            document.querySelector('.search-results').style.display = 'inherit'
            document.querySelector('.more-movie-info').style.display = 'none'
            document.querySelector('.my-watchlist').style.display = 'none'
        }
    }

    if (event.target.id == "search-btn") {
        searchForMovie(textInput.value)
        document.querySelector('.search-results').style.display = 'inherit'
        document.querySelector('.more-movie-info').style.display = 'none'
        document.querySelector('.my-watchlist').style.display = 'none'
    }

    if (event.target.dataset.movie_id) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        moreMovieInfo(event.target.dataset.movie_id)
    }

    if ((event.target.localName == 'button') && (event.target.className.includes('watchlist-btn'))) {
        isMovieInWatchlist(event.target.id)
    }

    if (event.target.id == 'go-back') {
        if (searchOrWatchList.textContent == `Back to Movies List`) {
            document.querySelector('.search-results').style.display = 'none'
            document.querySelector('.more-movie-info').style.display = 'none'
            document.querySelector('.my-watchlist').style.display = 'block'
        }
        else {
            document.querySelector('.search-results').style.display = 'inherit'
            document.querySelector('.more-movie-info').style.display = 'none'
            document.querySelector('.my-watchlist').style.display = 'none'
        }
    }
})

async function searchForMovie(text) {
    textInput.setAttribute('placeholder', `${(text) ? "Search for a movie" : "Searching without data" }`)

    const response = await fetch(`${baseURL}?apikey=${apiKey}&s=${text}`)
    const data = await response.json()

    moviesArray.splice(0)
    renderSearchResults(data)
}

function renderSearchResults(data) {
    const result =  getMovieHtmlPlaceholder(data)
    document.querySelector('.search-results').innerHTML = result

    // renderPageList(data)
}

function getMovieHtmlPlaceholder(data) {
    let htmlPlaceholder = ''
    if (data.Response == 'False') {
        return `
            <div class="result-is-false">
                Unable to find what you are looking for. Please try another search.
            </div>
        `
    }
    for (let i in data.Search) {
        const {imdbID} = data.Search[i]

        htmlPlaceholder += `
            <div class="results" id="${imdbID}">
            </div>
        `
        getMovies(imdbID)
    }
    return htmlPlaceholder
}

async function getMovies(imdbID) {
    const response = await fetch(`${baseURL}?apikey=${apiKey}&i=${imdbID}`)
    const movie = await response.json()
    moviesArray.push(movie)

    document.querySelector(`#${movie.imdbID}`).innerHTML = renderMovie(movie)
}

function renderMovie(movie) {
    return `
        <img class="movie-poster-img" data-movie_id="${movie.imdbID}" src="${movie.Poster}" alt="Poster image of the movie ${movie.Title}" />
        <div class="movie-info">
            <div class="movie-title-header">
                <h4 class="movie-title" data-movie_id="${movie.imdbID}">${movie.Title}</h4>
                <h6 class="movie-imdb-rating">&#11088; ${movie.imdbRating}</h6>
            </div>
            <div class="movie-release">
                <p class="movie-release-info">Release Date: ${movie.Released}</p>
            </div>
            <div class="extra-movie-info">
                <p class="movie-runtime">${movie.Runtime}</p>
                <p class="movie-genre">${movie.Genre}</p>
                <button class="add-rem-watchlist watchlist-btn" id="${movie.imdbID}"><span class="watchlist-span watchlist-btn">&nbsp;&plus;&nbsp;</span> Watchlist</button>
            </div>
            <div class="movie-plot">
                <p class="movie-plot-info">${movie.Plot}</p>
            </div>
        </div>
    `
}

async function moreMovieInfo(id) {
    const response = await fetch(`${baseURL}?apikey=${apiKey}&i=${id}&plot=full`)
    const selectedMovie = await response.json()

    document.querySelector('.search-results').style.display = 'none'
    document.querySelector('.more-movie-info').style.display = 'inherit'

    document.querySelector('.more-movie-info').innerHTML = `
    <div class="go-back"> <strong id="go-back"> < Back </strong> </div>
    <div class="more-movie-info-div">
        <div class="more-movie-info-header">
            <h3>${selectedMovie.Title}</h3>
            <h6> <strong> &#11088; ${selectedMovie.imdbRating}</strong>/10  from  ${selectedMovie.imdbVotes} votes</h6>
            <h5>${selectedMovie.Year} . Rated: ${selectedMovie.Rated} . Runtime: ${selectedMovie.Runtime}</h5>
        </div>
        <div class="more-movie-info-body">
            <img src="${selectedMovie.Poster}" alt="Poster image of the movie ${selectedMovie.Title}" />
            <div>
                <h6><span class="bold-text">Genres:</span> ${selectedMovie.Genre}</h6>
                <h6><span class="bold-text">Release Date:</span> ${selectedMovie.Released}</h6>
                <h6><span class="bold-text">Actors:</span> ${selectedMovie.Actors}</h6>
                <h6><span class="bold-text">Director(s):</span> ${selectedMovie.Director}</h6>
                <h6><span class="bold-text">Writer(s):</span> ${selectedMovie.Writer}</h6>
                <h6><span class="bold-text">Awards:</span> ${selectedMovie.Awards}</h6>
                <h6><span class="bold-text">BoxOffice:</span> ${selectedMovie.BoxOffice}</h6>
                <h6><span class="bold-text">IMDB:</span> ${selectedMovie.imdbID}</h6>
                <div class="more-movie-info-body-plot">
                    <p><strong class="bold-text">Full Plot:</strong></p>
                    <p>${selectedMovie.Plot}</p>
                </div>                
            </div>
        </div>
    </div>
    `
}

function isMovieInWatchlist(id) {

    if ( document.querySelector(`button#${id} span`).innerHTML == `&nbsp;+&nbsp;`) {
        const getMovieForWatchlist = moviesArray.filter(movie => {
            return movie.imdbID == id
        })

        const index = storedWatchlist.findIndex(item => item.imdbID === id);

        if (index < 0) {
            storedWatchlist.push(...getMovieForWatchlist.flat(Infinity))
        }

        document.querySelector(`button#${id} span`).innerHTML = `&nbsp;&minus;&nbsp;`
    }
    else if ( document.querySelector(`button#${id} span`).innerHTML == `&nbsp;−&nbsp;`)   {
        
        const index = storedWatchlist.findIndex(item => item.imdbID === id);
        storedWatchlist.splice(index, 1)
        document.querySelector(`button#${id} span`).innerHTML = `&nbsp;&plus;&nbsp;`
    }

    localStorage.setItem('stored_watchlist', JSON.stringify(storedWatchlist))

    renderWatchList(storedWatchlist)
}

function renderWatchList(storedWatchlist) {
    let watchlistHtml = ''
    if (storedWatchlist.length <= 0) {
        watchlistHtml= `
            <div class="initial-page">
                Your watchlist is looking a little empty...
                <br />
                <br />
                <p style="font-size:1.3rem; color:rgb(54,54,54)">
                    &nbsp;<span style="background-color:rgb(54,54,54)" class="watchlist-span">
                        &#43;
                    </span>&nbsp;Let's add some movies!
                </p>
            </div>
        ` 
    }
    else {
        storedWatchlist.forEach(movie => {
            watchlistHtml += `
                <div class="results watchlist" id="${movie.imdbID}">
                    <img class="movie-poster-img" data-movie_id="${movie.imdbID}" src="${movie.Poster}" alt="Poster image of the movie ${movie.Title}" />
                    <div class="movie-info">
                        <div class="movie-title-header">
                            <h4 class="movie-title" data-movie_id="${movie.imdbID}">${movie.Title}</h4>
                            <h6 class="movie-imdb-rating">&#11088; ${movie.imdbRating}</h6>
                        </div>
                        <div class="movie-release">
                            <p class="movie-release-info">Release Date: ${movie.Released}</p>
                        </div>
                        <div class="extra-movie-info">
                            <p class="movie-runtime">${movie.Runtime}</p>
                            <p class="movie-genre">${movie.Genre}</p>
                            <button class="add-rem-watchlist watchlist-btn" id="${movie.imdbID}"><span class="watchlist-span watchlist-btn">&nbsp;&minus;&nbsp;</span> Watchlist</button>
                        </div>
                        <div class="movie-plot">
                            <p class="movie-plot-info">${movie.Plot}</p>
                        </div>
                    </div>
                </div>
            `
        })
    }

    document.querySelector('.my-watchlist').innerHTML = watchlistHtml
}

// function renderPageList(data) {
//     /**Work on Rendering the page numbers later */
//     // const numberOfPages = Math.ceil(data.totalResults/data.Search.length)
//     // let pagelist = ''
//     // for (let i=1; i<=numberOfPages; i++) {
//     //     pagelist += `
//     //         <div>${i}</div>
//     //     `
//     // }
//     // document.querySelector('footer').innerHTML = pagelist
// }