// import Components from "views/Components/Components.jsx";
// import LandingPage from "views/LandingPage/LandingPage.jsx";
// import ProfilePage from "views/ProfilePage/ProfilePage.jsx";
import LoginPage from "views/LoginPage/LoginPage.jsx";
import Disciplinas from "views/Disciplinas/Disciplinas.jsx";
import SigninPage from "views/LoginPage/SignInPage.jsx";

var indexRoutes = [
  //  { path: "/landing-page", name: "LandingPage", component: LandingPage },
  //  { path: "/profile-page", name: "ProfilePage", component: ProfilePage },
   { path: "/disciplinas", name: "Disciplinas", component: Disciplinas },
   { path: "/signin", name: "Signin", component: SigninPage },
  { path: "/", name: "Components", component: LoginPage }
];

export default indexRoutes;
