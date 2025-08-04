import Slide_Carousel_Home from "../slide_carousel_home_component/slide_carousel_home";
import Home_Category_Second from "../home_category_second_componenet/home_category_second";
import Third_Home from "../third_home_component/Third_Home";
import Category_Home from "../category_home_component/Category_Home";
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
    </>
  );
};

export default Home;
