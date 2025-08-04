import Slide_Carousel_Home from "../slide_carousel_home_component/slide_carousel_home";
import Home_Category_Second from "../home_category_secons_componenet/home_category_second";
const Home = () => {
  
  const token = localStorage.getItem("access");
  const username = localStorage.getItem("username");


  return (
    <>
    <title>Home - BigHearts</title>
      {/* {token && username && <h1>Welcome, {username}!</h1>} */}

    <Slide_Carousel_Home/>
    <Home_Category_Second/>
  
    </>
  );
};

export default Home;
