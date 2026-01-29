import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LenisScroll from "../components/LenisScroll";

const MainLayout = () => {
  return (
    <>
      <LenisScroll />
      <Navbar />
      <Outlet />   {/* page content */}
      <Footer />
    </>
  );
};

export default MainLayout;
