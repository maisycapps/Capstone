import { useState } from "react";
// import "./Carousel.css";
import { images } from "../Components/Helpers/CarouselData";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function Carousel() {
  const [currImg, setCurrImg] = useState(0);

  return (
    <main className="carousel">
      <div
        className="carouselInner"
        style={{ backgroundImage: `url(${images[currImg].img})` }}
      >
        <div
          className="left"
          onClick={() => {
            currImg > 0 && setCurrImg(currImg - 1);
          }}
        >
          {/* <ArrowBackIosNewIcon style={{ fontSize: 30 }} /> */}
        </div>
        <div className="center">
          <h1>{images[currImg].title}</h1>
          <p>{images[currImg].subtitle}</p>
        </div>
        <div
          className="right"
          onClick={() => {
            currImg < images.length - 1 && setCurrImg(currImg + 1);
          }}
        >
          {/* <span style={{ fontSize: 30 }}>arrow_forward_ios</span> */}
          {/* <ArrowForwardIosIcon style={{ fontSize: 30 }} /> */}
        </div>
      </div>
    </main>
  );
}

export default Carousel;
