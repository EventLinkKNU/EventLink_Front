import React from "react";
import Footer from "./footer";
import Header from "./header";

const Layout = ({ children }) => {
    const layoutStyle = {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
    };

    const mainStyle = {
        flex: 1,
        padding: "20px",
    };

    return (
        <div style={layoutStyle}>
            <Header />
            <main style={mainStyle}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
