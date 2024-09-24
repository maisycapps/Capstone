import { NavLink } from "react-router-dom";

const AccountNav = () => {
    return ( 
        <>
            <NavLink to="followers">Followers</NavLink>
            <NavLink to="following">Following</NavLink>
            <NavLink to="myposts">Posts</NavLink>
            <NavLink to="mytrips">Trips</NavLink>
            <NavLink to="settings">Edit Account</NavLink>
        </>
        
     );
}
 
export default AccountNav;