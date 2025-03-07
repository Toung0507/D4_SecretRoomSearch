import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { Outlet } from "react-router-dom";

function Index() {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
export default Index;
