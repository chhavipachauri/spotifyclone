//beore dynamic

console.log("Lets start javascript")
let currentSong = new Audio(); //its a global variable
let songs;

let onlySongHttpArray = [];

//this function is to return the song list
//we are not using backend. direct server se lekr aenge songs api ka use karke
//this is client side project

//async function return promise isliye jnha display krwana h udhr b async and await use hoga
async function getSongs() {
    let a = await fetch("https://chhavipachauri.github.io/spotifyclone.github.io/songs/")
    let response = await a.text();
    // console.log(response);  //will print the whole html code having song names 
    let div = document.createElement("div")  //ye create kyu kiya
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")    //jo output m pura html code mila h usme anchor tag a m sare songs ka naam hai isliye
    // console.log(as)
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) //ab only wo anchor tag milenge jinme href k andr.mp3 hai...i.e.12
        {
            onlySongHttpArray.push(element.href);
            // songs.push(element.href);
            songs.push(element);     //ab har jagah songs.href use hoga harry ko modify kiya h humne....
        }
    }
    return songs;

}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formatedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formatedMinutes}:${formattedSeconds}`;
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track);
    // audio.play();    // these two lines were plaing all songs simultaneously on click and didnt stop the previous one
    console.log("current song name:- " + track)
    currentSong.src = ("/songs/" + track);
    // console.log(currentSong.src);
    if (!pause) {
        currentSong.play();
        play.src = "./img/pause.svg"
    }
    let songInfo = document.querySelector(".songInfo").innerHTML = track;
    let songTime = document.querySelector(".songTime").innerHTML = "00:00"

}
async function main() {
    //get the list of all songs
    songs = await getSongs();//this method will return list of all songs anchor tags list
    // console.log(songs);  //

    playMusic(songs[0].title, true); //to show name of first song bydefault on playbar

    //code to show all song names below your library(playlist)
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

    for (const song of songs) {
        // console.log(song);   //isme sirf anchor tag kyu ara hai
        // songUL.innerHTML += `<li> ${song.replaceAll("%20"), " "}</li>`; //harry ne esa kiya
        songUL.innerHTML += `<li> 
                                  <img  class="invert" width="34" src="./img/music.svg" alt="">
                            <div class="info">
                                <div>${song.title}</div>
                                <div>Artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                            <img src="./img/play.svg" alt="playImg" class="invert">
                            </div> 
        </li>`;
    }

    //Attach an event listener to each song
    let lisInSongList = document.querySelector(".songList").getElementsByTagName("li");
    // console.log(lisInSongList);
    let arraySongFullDetails = [];
    arraySongFullDetails = Array.from(lisInSongList);
    console.log(arraySongFullDetails);  //complete array of lists each list having 3 children and other things

    arraySongFullDetails.forEach(e => {
        // console.log(e);  //each element having three children
        e.addEventListener("click", element => {
            let x = e.querySelector(".info").firstElementChild.innerHTML;
            console.log(x);   //it will print only current song on which we have clicked in left playlist
            playMusic(x.trim());
        })
    });

    //Attach an event listener to play button
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();  //default method
            play.src = "./img/pause.svg"
            previous.src = "./img/prevsong.svg"
            next.src = "./img/nextsong.svg"
        }
        else {
            currentSong.pause();  //default method
            play.src = "./img/play.svg"
            previous.src = "./img/prevsong.svg"
            next.src = "./img/nextsong.svg"
        }
    })

    //Attach an event listener to update time duration, modify circle on seekbar
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);

        const formattedTime = secondsToMinutesSeconds(currentSong.currentTime);
        const formattedDuration = secondsToMinutesSeconds(currentSong.duration);

        document.querySelector(".songTime").innerHTML = `${formattedTime} / ${formattedDuration}`;
        document.querySelector(".circle").style.left = ((currentSong.currentTime / currentSong.duration) * 100) + '%';
        if (formattedTime == formattedDuration) {
            play.src = "./img/pause.svg"
        }
    })
    //add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = e.offsetX / (e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + '%';
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    //add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    //add an event listener for close svg
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
    })
    //add event listener to previous and next button
    previous.addEventListener("click", () => {
        console.log("previous clicked");
        let indexOfPrevClick;
        indexOfPrevClick = onlySongHttpArray.indexOf(currentSong.src) - 1;
        console.log(`song before prev clicked button: ${currentSong.src}`);

        console.log(`song played on previous click: ${indexOfPrevClick}\t upcoming song: ${indexOfPrevClick - 1}`);

        if (indexOfPrevClick >= 0) {
            let y = onlySongHttpArray[indexOfPrevClick].split("songs/", 2)[1].replaceAll("%20", " ");
            previous.src = "./img/prevsong.svg"
            play.src = "./img/pause.svg"
            playMusic(y,);
        }
        else {
            console.log("songs end");
            currentSong.pause();
            previous.src = "./img/reload.svg"
            play.src = "./img/play.svg"
            // console.log(indexOfPrevClick + " " + onlySongHttpArray.length);
            // let z = onlySongHttpArray[0].split("songs/", 2)[1].replaceAll("%20", " ");
            // currentSong.src = z;
        }

    })

    next.addEventListener("click", () => {
        currentSong.pause();
        console.log(currentSong.src); //current song ka http wala pura
        console.log(songs);   //it is not printing only all song names and we want array of only song names and not the other details.
        console.log(onlySongHttpArray); //array of all http.mp3
        let indexOfNextSong;
        console.log(`song before next clicked button: ${currentSong.src}`);
        indexOfNextSong = onlySongHttpArray.indexOf(currentSong.src) + 1;

        console.log(`song played on next click: ${indexOfNextSong}\t upcoming song: ${indexOfNextSong + 1}`);

        if (previous.src == "./img/reload.svg") {
            previous.src = "./img/prevsong.svg"
        }
        if (indexOfNextSong < onlySongHttpArray.length) {
            let y = onlySongHttpArray[indexOfNextSong].split("songs/", 2)[1].replaceAll("%20", " ");
            next.src = "./img/nextsong.svg"
            play.src = "./img/pause.svg"
            playMusic(y,);
        }
        else {
            console.log("songs end");
            currentSong.pause();
            next.src = "./img/reload.svg"
            play.src = "./img/play.svg"
            console.log(indexOfNextSong + " " + onlySongHttpArray.length);
            let z = onlySongHttpArray[0].split("songs/", 2)[1].replaceAll("%20", " ");
            currentSong.src = z;
        }
    })

    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to: ", e.target.value, "/100");
        currentSong.volume = parseInt(e.target.value) / 100
    })

    //add an event to mute the volume
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = 0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })
}
main();


// console.log(currentSong.src);
// console.log(songs[0].href);
// let a = [];
// for (let index = 0; index < songs.length; index++) {
//     const element = songs[index];
//     if (element.href.endsWith(".mp3")) {
//         a.push(element.href);
//     }
// }
// console.log(a)
// // currentSong.src.indexOf(song.href)
// let index
// index = a.indexOf(currentSong.src)
// console.log(index)