
import styles from "./FooterStyle.module.css"

function Footer() {
    return (

        <footer className={styles.footer}>
            <div className={styles.footer__container}>
                {/*   social media icons                 */}
                <ul className={styles.footer__socialmedia__icons}>
                    <li ><a href="#" className={styles.footer__socialmedia__icon} aria-label="Social 1"></a></li>
                    <li ><a href="#" className={styles.footer__socialmedia__icon} aria-label="Social 2"></a></li>
                    <li ><a href="#" className={styles.footer__socialmedia__icon} aria-label="Social 3"></a></li>
                    <li ><a href="#" className={styles.footer__socialmedia__icon} aria-label="Social 4"></a></li>
                </ul>
                {/*           copyrights        */}
                <div className={styles.footer__copyrights}>
                    <p className={styles.footer__copyrights__text}>&copy; {new Date().getFullYear()} SchoolNet. All rights reserved.</p>
                </div>

            </div>
        </footer>




    );
}

export default Footer;