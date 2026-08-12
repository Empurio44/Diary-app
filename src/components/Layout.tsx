import { NavLink, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "\u{1F4CA}", end: true },
  { to: "/counters", label: "Counters", icon: "\u{1F522}", end: false },
  { to: "/habits", label: "Habits", icon: "\u{1F525}", end: false },
  { to: "/logs", label: "Logs", icon: "\u{1F4C8}", end: false },
  { to: "/diary", label: "Diary", icon: "\u{1F4D3}", end: false },
];

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;
}

function tabLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? `${styles.tabLink} ${styles.tabLinkActive}` : styles.tabLink;
}

export default function Layout() {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>{"\u{1F4CA}"}</span>
          <span className={styles.brandName}>Life Stats</span>
        </div>
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.footer}>Tracked locally in this browser session.</div>
      </aside>

      <div className={styles.main}>
        <div className={styles.topbar}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>{"\u{1F4CA}"}</span>
            <span className={styles.brandName}>Life Stats</span>
          </div>
        </div>
        <Outlet />
      </div>

      <nav className={styles.tabbar}>
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={tabLinkClass}>
            <span className={styles.tabIcon}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
