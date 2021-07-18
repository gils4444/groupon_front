import { Component } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Routing from "../Routing/Routing";
import "./Layout.css";

class Layout extends Component {

    public render(): JSX.Element {
        return (
            <div className="Layout">
                <header>
                    <Header />
                </header>
                <main>
                    <Routing/>
                </main>
                <footer>
                    <Footer />
                </footer>
            </div>
        );
    }
}

export default Layout;
