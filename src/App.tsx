import { createBrowserRouter } from "react-router";
import Layout from "./components/layout";
import Home from "./pages/home";
import CarDetail from "./pages/car";
import Estoque from "./pages/estoque";
import TestDrive from "./pages/test-drive";
import Favorites from "./pages/favorites";
import Sell from "./pages/sell";
import Dashboard from "./pages/dashboard";
import New from "./pages/dashboard/new";
import Edit from "./pages/dashboard/edit";
import Vendas from "./pages/dashboard/vendas";
import Login from "./pages/login";
import Register from "./pages/register";
import Private from "./routes/Private";
import Public from "./routes/Public";
import NotFound from "./pages/notfound";


export const router = createBrowserRouter([
  {
    element: <Home/>,
    path: "/"
  },
  {
    element: <Layout/>,
    children: [
      {
        element: <CarDetail/>,
        path: "/car/:id"
      },
      {
        element: <Estoque/>,
        path: "/estoque"
      },
      {
        element: <TestDrive/>,
        path: "/agendar-test-drive"
      },
      {
        element: <Favorites/>,
        path: "/favoritos"
      },
      {
        element: <Sell/>,
        path: "/vender"
      },
      {
        element: <Private><Dashboard/></Private>,
        path: "/dashboard"
      },
      {
        element: <Private><New/></Private>,
        path: "/dashboard/new"
      },
      {
        element: <Private><Edit/></Private>,
        path: "/dashboard/edit/:id"
      },
      {
        element: <Private><Vendas/></Private>,
        path: "/dashboard/vendas"
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