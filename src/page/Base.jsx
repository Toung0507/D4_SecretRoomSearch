import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";

function Index() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <ScrollToTop />
      <Header />
      <main className="flex-grow-1 d-flex flex-column">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
export default Index;
