const header_refresh_rate = 100;
const header_lock_duration = 1000;

var header = null;
var main_content = document.querySelector("main");
var waiting = false;
var block_header = false;
function main() {
    // Get the header element
    header = document.getElementById("header");
    updateHeader();
    // Get the --mobile variable
    var mobile = getComputedStyle(document.documentElement).getPropertyValue("--mobile");
    
    // If the device is not a mobile, start the video
    if (mobile == 0) {
        var video = document.querySelector("#video-presentation");
        video.play();
    }

    // Detect if the browser is webkit  
    if (navigator.userAgent.toLowerCase().indexOf('webkit') != -1 && mobile == 0) {
        // Get all sections
        var sections = document.getElementsByTagName("section");
        // Loop through all sections
        for (var i = 0; i < sections.length; i++) {
            // Do not set the background position
            // because this causes visual glitches on webkit
            sections[i].style.backgroundPosition = "unset";
        }
    }

    // Get the navigation element
    var navigation = document.querySelectorAll(".navigation");
    // Loop through all navigation elements
    for (var i = 0; i < navigation.length; i++) {
        //Check if the node contains a span
        if (navigation[i].querySelector("span")) {
            // Set the span's href to the navigation element's href
            navigation[i].querySelector("span").setAttribute("href", navigation[i].getAttribute("href"));
        }
        if (navigation[i].getAttribute("href") != "#landing") {
            // Add the click event listener
            navigation[i].addEventListener("click", function (event) {
                // Prevent the default action
                event.preventDefault();
                // Get the target element
                var target = event.target;
                // Get the target element
                var element = document.querySelector(target.getAttribute("href"));
                // Scroll to the element
                main_content.scrollTop = element.offsetTop;
            });
        } else {
            navigation[i].addEventListener("click", function (event) {
                event.preventDefault();
                var target = event.target;
                var element = document.querySelector(target.getAttribute("href"));
                main_content.scrollTop = 0;
                block_header = true;
                updateHeader(false, true);
                // Unblock the header after 1 second
                setTimeout(() => { block_header = false; }, header_lock_duration);
            });
        }
    }

    // Get the .transitions element
    var transitions = document.querySelectorAll(".transitions");
    // Loop through all .transitions &elements
    for (var i = 0; i < transitions.length; i++) {
        /* add "transition: all 0.5s ease-out;" to the style */
        transitions[i].style.transition = "all 0.5s ease-out";
    }

    main_content.onscroll = function () {
        if (waiting || block_header) {
            return;
        }
        waiting = true;
        setTimeout(function () {
            if (!block_header)
                updateHeader();
            waiting = false;
        }, header_refresh_rate); // Reduce the number of calls to updateHeaderHeight()
    };

}

function updateHeader(force_small = false, force_big = false) {
    if (force_small) {
        header.classList.remove("top");
        return;
    }
    if (force_big) {
        header.classList.add("top");
        return;
    }
    var scrollTop = main_content.scrollTop;
    // Check if the user scrolled to the top
    if (scrollTop == 0) {
        header.classList.add("top");
    }
    else {
        header.classList.remove("top");
    }
}

window.onload = main;

