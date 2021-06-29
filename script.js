// namespace
const animeApp = {
    animeArray: [],
    counterArray: [],
    position: -1,
};
$(function () {
    animeApp.animeContainer = function (title, syn, url, url2, score) { //constructor object
        this.title = title,
            this.synopsis = syn,
            this.imageURL = url,
            this.url = url2,
            this.score = score
    }


    animeApp.startSearch = function (page, genre,) { //api function

        $.ajax({
            url: "https://api.jikan.moe/v3/search/anime",
            method: "GET",
            dataType: "json",
            data: {
                type: "anime",
                page: page.toString(),
                genre: genre.toString(),


            }, error: function (request, status, error) { //if error 404 or something else occurs try again
                animeApp.startSearch($('#totalAnimeAmount').val(), Number($('#animeGenreType').val()));
            }, beforeSend: function () { //loading gif
                $(".loadingDiv").show();
            },
            success: function (data) { //remove loading gif
                $(".loadingDiv").hide();
            }
        }).then(function (data) {
            // console.log(data); //used for testing purposes

            for (let i = 0; i < (data["results"].length); i++) { //loop through data and take important data and create objects of each data inside animeApp.animeContainer object
                if (data["results"][i]['title'] !== 'undefined' && data["results"][i]['rated'] !== "Rx" && data["results"][i]['rated'] !== "R+") { //if data is not broken and it is not rated mature create object
                    position++; //used to hold global position of array starts at -1 non valid array position

                    if (data["results"][i]["score"] == 0) { //score of zero is not available
                        data["results"][i]["score"] = "NA";
                    }

                    animeArray[position] = new animeApp.animeContainer(data["results"][i]['title'], data["results"][i]['synopsis'], data["results"][i]['image_url'], data["results"][i]["url"], data["results"][i]["score"]); //create the object at array position
                }
            }
            animeApp.start(); //display content on screen
        });

    }
    // this api is a web scraping api so it works from my understanding by going through specific pages on myanimelist and taking out specific content so it needs to be called enough time on different pages to get 

    animeApp.initiateSearch = function (pages, genre) { //start search checks enough pages to get near max anime showing
        for (let i = 1; i <= pages; i++) {
            let num = Math.floor(Math.random() * (501));
            while (animeApp.counterArray.includes(num)) { //if number exists in array then this page has already been checked try again most likely wont happen because of large number range but just in case it does
                num = Math.floor(Math.random() * (10));
            }
            animeApp.counterArray.push(num); //add current page index to array
            animeApp.startSearch(num, genre);
        }

    }

    $("#formSubmit2").click(function (e) { //form submit
        e.preventDefault(); //prevent default of submit button
        $(".information").hide();
        animeArray = []; //reset
        counterArray = []; //reset 
        position = -1; //reset
        document.getElementById('mainContainer').innerHTML = ''; //reset
        animeApp.initiateSearch($('#totalAnimeAmount').val(), $('#animeGenreType').val()); //start search with values

    });

    animeApp.start = function () { //now display array after shuffling it

        for (let i = 0; i < animeArray.length; i++) { //shuffle array to make it more random
            let swapping = animeArray[i]; //assign variable the first element in array (willSwap)
            let beingSwapped = null; //second variable that will be used to store the swapped array (isSwapped)

            let num = Math.floor(Math.random() * (animeArray.length - 1)); //random num generated for swap
            beingSwapped = animeArray[num]; //take the value at the index of array num

            animeArray.splice(num, 1, swapping); //at random generated num index change to the first element we took (willSwap)
            animeArray.splice(i, 1, beingSwapped); //now we have two elements that are the same (two willSwap) so change the original willSwapped to wasSwapped

        }

        animeArray.forEach(animeContainer => { //display our new array of objects

            $('#mainContainer').append(`<div class="innerContainer"> <a class="clickableObject" href="${animeContainer.url}" target="_blank"><h2 class="innerTitle">${animeContainer.title} </h2><img src="${animeContainer.imageURL}" alt=""> <p class ="malScore">${animeContainer.score}/10 </p> <p class="synopsis">${animeContainer.synopsis} </p> </a></div>`);
        });

    }

    // TAKEN FROM : https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
    let mybutton = document.getElementById("myBtn");

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function () { scrollFunction() };

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }

    // When the user clicks on the button, scroll to the top of the document
    animeApp.topFunction = function () {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

});

