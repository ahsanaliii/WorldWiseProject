import React from "react";
import styles from "./AppNav.module.css";
import { NavLink } from "react-router-dom";

export default function AppNav() {
  return (
    <div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <NavLink to="cities">Cities</NavLink>
          </li>
          <li>
            <NavLink to="countries">countries</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
