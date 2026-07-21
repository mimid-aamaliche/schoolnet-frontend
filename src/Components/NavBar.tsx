
import { useEffect, useRef } from "react";
import styles from "./NavBarStyle.module.css";
import { Link, NavLink } from "react-router-dom";

type NavBarProps = {
  user_is_loged_in: boolean;
  logo: string;
  profil_image?: string;
};

function NavBar(props: NavBarProps) {
  const navRef = useRef<HTMLElement>(null);

  // Activate frosted-glass blur on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        navRef.current.classList.toggle(styles.scrolled, window.scrollY > 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={styles.navBar} ref={navRef}>
      {/* Left: logo + nav links */}
      <ul className={styles.navBar__items__left}>
        <li className={styles.navBar__listItem}>
          <Link to="" className={styles.navBar__logoLink}>
            <span className={styles.navBar__logoText}>School Net</span>
          </Link>
        </li>

        {props.user_is_loged_in && (
          <li className={`${styles.navBar__item} ${styles.navBar__listItem}`}>
            <NavLink to="/Home">Home</NavLink>
          </li>
        )}

        <li className={`${styles.navBar__item} ${styles.navBar__listItem}`}>
          <NavLink to="/Courses">All Courses</NavLink>
        </li>

        {props.user_is_loged_in && (
          <li className={`${styles.navBar__item} ${styles.navBar__listItem}`}>
            <NavLink to="/MyCourses">My Courses</NavLink>
          </li>
        )}
      </ul>

      {/* Right: auth + profile */}
      <ul className={styles.navBar__items__right}>
        {!props.user_is_loged_in && (
          <li className={`${styles.navBar__item} ${styles.navBar__listItem}`}>
            <NavLink to="/LogIn">Log In</NavLink>
          </li>
        )}

        {!props.user_is_loged_in && (
          <li className={`${styles.navBar__item} ${styles.navBar__listItem} ${styles["navBar__item--cta"]}`}>
            <NavLink to="/Signin">Sign Up</NavLink>
          </li>
        )}

        {/*props.user_is_loged_in && (
          <li className={styles.navBar__listItem}>
            <Link to="">
              <img
                className={styles.navBar__profilePicture}
                src={props.profil_image ?? "/images/brainstorm-meeting.jpg"}
                alt="profile"
              />
            </Link>
          </li>
        )*/}
      </ul>
    </nav>
  );
}

export default NavBar;
