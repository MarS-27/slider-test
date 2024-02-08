import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "./style.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Player from "@vimeo/player";

const VIDEO_URL = "https://player.vimeo.com/video/";
const GET_PREVIEW_IMG_URL =
  "https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/";

const videoList = Array.from({ length: 8 }, () => ({
  videoId: "824804225",
}));

const mainSwiper = document.getElementById("mainSwiperWrapper");
const popUpSwiper = document.getElementById("popUpSwiperWrapper");
const popUp = document.getElementById("popUp");
const loader = document.querySelector(".loader");

const getThumbnailUrl = async (videoId) => {
  const res = await fetch(`${GET_PREVIEW_IMG_URL}${videoId}`, { method: "GET" })
    .then((data) => data.json())
    .then((data) => data.thumbnail_url);

  return res;
};

const mainSwiperInit = (imagesUrls) => {
  const mainSwiperItems = imagesUrls.map(
    (thumbnail_url) =>
      `<img class="swiper-slide preview-image" src=${thumbnail_url} alt="Video preview" />`
  );

  mainSwiper.insertAdjacentHTML("beforeend", mainSwiperItems.join(""));

  new Swiper(".main-swiper", {
    modules: [Navigation],
    loop: true,
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
    },
  });

  loader.remove();
};

const popupSwiperInit = () => {
  const previwImage = document.querySelectorAll(".preview-image");
  const hidePopUp = document.getElementById("hidePopUp");

  const popUpSwiperItems = videoList.map(
    (video) =>
      `<iframe
        src="${VIDEO_URL}${video.videoId}"
        class="swiper-slide"
        width="600"
        height="600"
        frameborder="0"
        allow="autoplay"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen
      ></iframe>`
  );

  popUpSwiper.insertAdjacentHTML("beforeend", popUpSwiperItems.join(""));

  const iframe = document.querySelectorAll("iframe");
  let player = null;

  const swiper = new Swiper(".popup-swiper", {
    modules: [Pagination],
    slidesPerView: 1,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    on: {
      slideChange: (swiper) => {
        if (player) {
          player.unload();
        }

        player = new Player(iframe[swiper.activeIndex]);
        player.play();
      },
    },
  });

  previwImage.forEach((elem, i) => {
    elem.addEventListener("click", () => {
      player = new Player(iframe[i]);
      swiper.slideTo(i);
      popUp.classList.add("show-popup");
      player.play();
      player.getPlayed;
    });
  });

  hidePopUp.addEventListener("click", function () {
    player.unload();
    player = null;
    popUp.classList.remove("show-popup");
  });
};

Promise.all(
  videoList.map(async (video) => {
    return await getThumbnailUrl(video.videoId);
  })
).then((urls) => {
  mainSwiperInit(urls);
  popupSwiperInit();
});
