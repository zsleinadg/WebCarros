import { createBrowserRouter } from "react-router";
import Layout from "./components/layout";
import Home from "./pages/home";
import CarDetail from "./pages/car";
import Dashboard from "./pages/dashboard";
import New from "./pages/dashboard/new";
import Login from "./pages/login";
import Register from "./pages/register";
import Private from "./routes/Private";
import Public from "./routes/Public";
import NotFound from "./pages/notfound";


export const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        element: <Home/>,
        path: "/"
      },
      {
        element: <CarDetail/>,
        path: "/car/:id"
      },
      {
        element: <Private><Dashboard/></Private>,
        path: "/dashboard"
      },
      {
        element: <Private><New/></Private>,
        path: "/dashboard/new"
      }
    ]
  },
  {
    element: <Public><Login/></Public>,
    path: "/login"
  },
  {
    element: <Public><Register/></Public>,
    path: "/register"
  },
  {
    element: <NotFound/>,
    path: "*"
  }
])