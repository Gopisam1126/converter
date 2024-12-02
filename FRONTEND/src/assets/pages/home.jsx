import Header from "../components/header";
import CreateArea from "../components/createArea";
import Footer from "../components/footer";
import "../pageStyles/home.css"

function Home() {
    return <>
        <section className="home-main-s txt-grey">
            <div className="header-sec">
                <Header/>
            </div>
            <div className="body-f-sec pad-main ">
                <CreateArea/>
                <Footer/>
            </div>
        </section>
    </>
}

export default Home;