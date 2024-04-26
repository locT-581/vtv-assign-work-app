import React from "react";
import logoImage from "../assets/svg/logoVTV.svg";

import { Link } from "react-router-dom"

import { useNavigate } from "react-router-dom";
import { signOut,  } from "firebase/auth"
import { auth } from "../firebase"

const UserSidebar = ({children}) => {
    const navigate = useNavigate();
    const handleSignOut = () => {
        signOut(auth)
            .then(()=>{
                console.log("Sign Out")
                navigate("/");
                } 
            )
            .catch((error) => console.log(error))
    }

    return (
            <div className="sidebar">
                <div className="sidebarinside">
                    <div className="logo-placeholder">
                        <img src={logoImage} alt="logo" className="logosidebar" />
                    </div>
                    <div className="title">
                        <h2>Xin Chào</h2>
                        <h1>User</h1>
                    </div>
                    <ul>
                        <li>
                            <Link to="/xem-yeu-cau">
                                Xem yêu cầu
                            </Link> 
                        </li>
                        <li>Menu Item 2</li>
                        <li>Menu Item 3</li>
                    </ul>
                    <div className="logout-button">
                        <button onClick={handleSignOut}>Đăng xuất</button>
                    </div>
                    <div>
                        <h6>
                            VTVapp v1.0
                        </h6>
                    </div>
                </div>
            </div>
    );
};

export default UserSidebar;
