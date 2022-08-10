import { Link } from "react-router-dom";

function MenuLink() {
    return (<>
        <nav style={{ borderBottom: "solid 1px", paddingBottom: "1rem", }}>
            <Link to={'/ecs/'}>[Inicio]</Link>
            <Link to={'/ecs/mergespedxml'}>[Mesclar SPED e XML]</Link>
        </nav>
    </>);
}

export default MenuLink;