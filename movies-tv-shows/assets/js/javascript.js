var modalEl = $("#modal-js");

let menuItem;
let category;
let title;
let start = 0;
let end = 10;
let imdID;
let index;
let rating;
let stream;
let showLink;

let searchHistory = {
    title: [],
};

const min = 0;
const max = 250;

$(document).ready(function() {

            // where to watch 
            function watchFetch(res) {
                const apiUrl = `https://api.themoviedb.org/3/movie/${imdId}/watch/providers?api_key=${apiKeys.watchmode}`;

                $.ajax({
                    method: "GET",
                    url: apiUrl,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    error: function(error) {
                        console.log(error);
                    },
                    success: function(data) {
                        // if successful
                        moreInfoModal(res, data)
                        console.log(data)
                    },

                });

            } // end of watchFetch()

            // fetch movies
            function fetchMoviesList() {
                const apiUrl = `https://imdb-api.com/en/API/${category}/${apiKeys.imdb}`;

                fetch(apiUrl)
                    .then(function(response) {
                        if (response.ok) {
                            response.json().then(function(res) {
                                // console.log(res);
                                if (category === "Top250Movies") {
                                    displayTopTen(res);
                                } else {
                                    displayMostPopular(res, start, end);
                                }
                            });
                        }
                    })
                    .catch(function(error) {
                        openModal(modalEl);
                        $(".modal").on("click", function(event) {
                            closeModal(modalEl);
                        });
                    });
            }

            // get Top 10 Tv Shows
            function fetchTvList() {
                const apiUrl = `https://imdb-api.com/en/API/${category}/${apiKeys.imdb}`;

                $.ajax({
                    method: "GET",
                    url: apiUrl,
                    dataType: "json",
                    error: function(error) {
                        console.log(error);
                    },
                    success: function(res) {
                        // if successful
                        // console.log(response)
                        if (category === "Top250TVs") {
                            displayTopTen(res);
                            // console.log(res)
                        } else {
                            displayMostPopular(res, start, end);
                        }
                    },
                });
            }

            // display 10 random list
            function displayTopTen(res) {

                if ($(".show-list-header").length) {
                    $(".p-title").empty();
                    $(".place-holder-image").remove();
                }

                $(".p-title").append(`${menuItem}`);
                $(".p-title").append(`<div class="column show-list"></div>`);

                for (let i = 0; i < 10; i++) {
                    let random = Math.floor(Math.random() * (max - min)) + min;
                    // console.log(res.items[random].id)
                    $(".show-list").append(`
        <div class="column is-3 has-text-dark has-background-light show-posters mt-3 mb-3 is-size-5 is-inline-block">
        <img class="poster" src="${res.items[random].image}" data-id="${res.items[random].id}" data-value="${random}"width="120px" height="120px">
    <p>${res.items[random].fullTitle}</p>
    </div>
    `);
                }

                // // show more info when user click on poster
                $(".poster").on("click", function(event) {
                    event.stopPropagation();

                    index = event.target.dataset.value;
                    imdId = event.target.dataset.id;
                    console.log(imdId)

                    if (category === "Top250Movies") {
                        watchFetch(res)
                    } else {
                        let data = {
                                results: {
                                    CA: {
                                        link: 'not-available'
                                    }
                                }
                            }
                            // console.log(data)
                        moreInfoModal(res, data)

                    }

                    // moreInfoModal(res, data)
                });

            }

            // modal
            function moreInfoModal(res, data) {

                let rating = Math.floor(res.items[index].imDbRating);
                // open the modal
                $(".modal").addClass("is-active");

                $(".box-info").append(`
        <div class="modal-items">
        <img class="modal-poster" src="${res.items[index].image}" width="200px" height="200px">
        <div class="attributes">
        <p><strong>Title:</strong> ${res.items[index].fullTitle}</p>
        <p><strong>Actors/Actresses:</strong> ${res.items[index].crew}</p>
        <p><strong>Year:</strong> ${res.items[index].year}</p>
        <p><strong>Rank:</strong> ${res.items[index].rank}
        <p><strong>Rating:</strong>
        ${Array(rating)
          .fill()
          .map(
            (item, i) => `
          <img src="./assets/img/rating.png" width="20px" heigh=20px"></img>`
          )
          .join("")}
          <p><strong>stream:</strong><a href="${data.results.CA.link}" target="_blank"> themoviedb.org - ${res.items[index].fullTitle}</strong>
      </div>
      </div>
       
        `);

        // close the modal
        $(".modal").on("click", function(event) {
            if (!$(event.target).closest(".modal-content, modal").length) {
                $("body").find(".modal").removeClass("is-active");
                $(".box-info").html("");
            }
        });
    } // end of modal()

    function displayMostPopular(res, start, end) {
        if ($(".show-list-header").length) {
            $(".p-title").empty();
            $(".place-holder-image").remove();
        }
      
        $(".p-title").append(`${menuItem}`);
        $(".p-title").append(`<div class="column show-list"></div>`);

        // $.each(response, function(index) {
        for (let i = start; i < end; i++) {
            $(".show-list").append(`
            <div class="column has-text-dark has-background-light show-posters mt-3 mb-3 is-size-5 is-inline-block">
            <img class="poster" src="${res.items[i].image}" data-value="${i}" width="120px" height="120px" >
            <p>${res.items[i].fullTitle}</p>
            <p><strong># ${res.items[i].rank}</p>
        </div>
        `);
        }

        $(".p-title").append(`<div class="column more-icon">
        <span class="material-icons icon-left">keyboard_double_arrow_left</span>
        <span class="material-icons icon-right">keyboard_double_arrow_right</span>
        </div>`);

        $(".icon-left").on("click", function() {
            if (end === 10) {
                return;
            }

            if (start != 0) {
                start -= 10;
                end -= 10;
            } else if ($(".show-list").length) {
                $(".show-listing").empty();
                $(".material-icons").empty();
            }

            displayMostPopular(res, start, end);
        });

        $(".icon-right").on("click", function() {
            start += 10;
            end += 10;

            if (end > 100) {
                return;
            }

            if ($(".show-list").length) {
                $(".show-listing").empty();
                $(".material-icons").empty();
            }
            displayMostPopular(res, start, end);
        });

        // // show more info when user click on poster
        $(".poster").on("click", function(event) {
            event.stopPropagation();

            index = event.target.dataset.value;
            imdId = event.target.dataset.id;
            console.log(category)

            if (category === "Top250Movies" || category === "MostPopularMovies") {
                watchFetch(res)
            } else {
                let data = {
                        results: {
                            CA: {
                                link: 'not-available'
                            }
                        }
                    }
                moreInfoModal(res, data)

            }

            // moreInfoModal(res, data)
        });
    } // end of displayMostPopTv

    /*
     * modal for fetch error
     */
    function openModal(el) {
        modalEl[0].classList.add("is-active");
        document.querySelector(".box-info").textContent =
            "Unable to connect to Movies API";
    }

    function closeModal(el) {
        modalEl[0].classList.remove("is-active");
    }

    /*
     * Search fetch
     */
    function search(category, title) {
        const apiUrl = `https://imdb-api.com/en/API/${category}/${apiKeys.imdb}/${title}`;

        $.ajax({
            method: "GET",
            url: apiUrl,
            dataType: "json",
            error: function(error) {
                console.log(error);
            },
            success: function(response) {
                // if successful
                // console.log(response)
                if (!response){
                    return;
                }
                searchResult(response)
            },
        });
    } // end of search()

    /*
     * Search Result
     */
    function searchResult(response) {
        if ($(".show-list-header").length) {
            $(".p-title").empty();
        }
        // console.log(response)
        var length = response.results.length;

        $(".p-title").append(`${menuItem}`);
        $(".p-title").append(`<div class="column show-list"></div>`);
        for (let i = 0; i < length; i++) {
            $(".show-list").append(`
    <div class="column is-3 has-text-dark has-background-light show-posters mt-3 mb-3 is-size-5 is-inline-block">
     <img class="poster" src="${response.results[i].image}" data-id="${response.results[i].id}" data-value="${i}"width="120px" height="120px">
     <div class="text">
     <p>${response.results[i].title}</p>
     <p>${response.results[i].description}</p>
    </div>
    </div>
        `);
        }

        $(".poster").on("click", function(event) {
            event.stopPropagation();
            imdId = event.target.dataset.id;
            let id = event.target.dataset.value;

            console.log(imdId)
            searchMoreInfo(imdId)
        });

      
    } // end of poster event


// GET MORE SEARCH INFO
function searchMoreInfo(imdId) {
    // console.log(imdId)
    const apiUrl = `https://imdb-api.com/en/API/Title/${apiKeys.imdb}/${imdId}/FullActor,FullCast,Posters,Trailer,Ratings,Wikipedia,`;

    $.ajax({
        method: "GET",
        url: apiUrl,
        dataType: "json",
        error: function(error) {
            console.log(error);
        },
        success: function(response) {
            // if successful
            // console.log(response)
            if (!response){
                return;
            }
            displayMoreSearchResult(response)
        },
    });
} // end of search()


function displayMoreSearchResult(response){
    
    // console.log(response)
    $(".modal").addClass("is-active");
    $(".box-info").append(`
    <div class="more-info">
    <div class="modal-items">
    <img src="${response.image}" has-text-centered width="280px" height="280px">
    <p><strong>Title:</strong> ${response.fullTitle}</p>
    <p><strong>Plot:</strong> ${response.plot}</p>
    <p><strong>Genres:</strong> ${response.genres}
    <p><strong>Year:</strong> ${response.year}
    <p><strong>Release Date:</strong> ${response.releaseDate}
   <p><strong>Rating:</strong> ${response.imDbRating}
    `);
      // close the modal
      $(".modal").on("click", function(event) {
        if (!$(event.target).closest(".modal-content, modal").length) {
            $("body").find(".modal").removeClass("is-active");
            $(".box-info").html("");
        }
    });

}

    // event listeners declaration
    $(".tv-show-btn").on("click", function(event) {
        event.stopPropagation();

        if ($(".show-list-header").length) {
            $(".p-title").empty();
        }

      category = event.target.dataset.tv;

        if (category === "Top250TVs") {
            menuItem = $("#3").text();
        } else {
            menuItem = $("#4").text();
        }
        fetchTvList();
    });

    $(".movies-btn").on("click", function(event) {
        event.stopPropagation();

        if ($(".show-list-header").length) {
            $(".p-title").empty();
        }

       category = event.target.dataset.movie;

        if (category === "Top250Movies") {
            menuItem = $("#1").text();
        } else {
            menuItem = $("#2").text();
        }
        fetchMoviesList();
        // event.stopPropagation();
    });

    $("#search-btn").on("click", function() {

        let type = document.getElementById("search-type");
        category = type.value;    
        title = $(".input").val();

        if (!title){
            return;
        }

        if (category === "SearchMovie") {
            menuItem = "Movies";
        }

        if (category === "SearchSeries") {
            menuItem = "TV Series";
        }

        if (category === 'SearchMovies' || 'SearchSeroes') {
        
            search(category, title);
            addHistory(title)
        }

      return
    });

        // search history input
        $("#title").change("click",function() {
            let type = document.getElementById("search-type");
            category = type.value;    
            titleName = $(".input").val();

            if (!titleName){
                return
            }

            if (category == 'Search by Type:'){
                return
            }

            if (category === "SearchMovie") {
                menuItem = "Movies";
            }
    
            if (category === "SearchSeries") {
                menuItem = "TV Series";
            }
            
        if (category === 'SearchMovies' || 'SearchSeries') {
            search(category, titleName);
        }
         return
    
        });

        function onLoad() {
            if (localStorage.getItem("searchTitle")) {
                searchHistory = JSON.parse(localStorage.getItem("searchTitle"));
    
                $.each(searchHistory.title, function(index) {
                    $("#history").append(`
                    <option value="${searchHistory.title[index]}"</option>
                    `);
                });
            }
        }
    
        function addHistory(moveTvTitle) {
            if (!searchHistory.title.includes(title)) {
                searchHistory.title.push(title);
                localStorage.setItem("searchTitle", JSON.stringify(searchHistory));
                $("#history").empty();
                onLoad();
            }
            return;
        }

    onLoad();
});