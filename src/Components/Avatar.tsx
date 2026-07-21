import { useEffect, useState } from "react";

import styles from "./HomePageStyle.module.css";

const initials = (name?: string) =>
  name
    ? name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()
    : "?";


 export default function Avatar({ name, image }: { name?: string; image?: string }) {
  if (!name) return <div className={styles.avatarInitials}>?</div>;
  if (image) return <img src={image} alt={name} className={styles.avatar} />;
  return <div className={styles.avatarInitials}>{initials(name)}</div>;
}