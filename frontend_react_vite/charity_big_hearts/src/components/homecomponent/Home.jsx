import Slide_Carousel_Home from "../slide_carousel_home_component/slide_carousel_home";
import Home_Category_Second from "../home_category_second_componenet/home_category_second";
import Third_Home from "../third_home_component/Third_Home";
import Category_Home from "../category_home_component/Category_Home";
import Fifth_Home from "../fifth_home_component/Fifth_Home";
import All_Category_Home from "../all_category_home_component/All_Category_Home";
import Mission_Vision_Values from "../mission_vision_values_component/Mission_Vision_Values";
import Donations_Cards from "../donations_cards_component/Donations_Cards";
import bgImage from "../../../src/assets/home-bg2.jpg"
const partnerImages = [
  "partners_01.png",
  "partners_02.png",
  "partners_03.png",
  "partners_04.png",
  "partners_05.png",
  "partners_06.png",
];

const Home = () => {
  
  const token = localStorage.getItem("access");
  const username = localStorage.getItem("username");


  return (
    <>
    <title>Home - BigHearts</title>
      {/* {token && username && <h1>Welcome, {username}!</h1>} */}

    <Slide_Carousel_Home/>
    <Home_Category_Second/>
    <Third_Home/>
    <Category_Home/>
    <Fifth_Home bgImage={bgImage} bgColor={null} partnerImages={partnerImages} />
    <Donations_Cards/>
    <Mission_Vision_Values/>
    <All_Category_Home/>
    </>
  );
};

export default Home;
