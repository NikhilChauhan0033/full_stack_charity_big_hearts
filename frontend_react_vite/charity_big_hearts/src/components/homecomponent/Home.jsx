
const Home = () => {
  
  const token = localStorage.getItem("access");
  const username = localStorage.getItem("username");


  return (
    <>
    <title>Home - BigHearts</title>
      {token && username && <h1>Welcome, {username}!</h1>}
      <h2>Welcome to Home</h2>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque optio nihil qui illum obcaecati voluptates similique ex, molestias rem ut consectetur nisi distinctio quam quo sequi laborum minus maiores voluptatibus.</p>
  
    </>
  );
};

export default Home;
